'use strict';

class Apod {

    constructor () {
        this.date;
        this.url;
        this.hdurl;
        this.title;
        this.description;
        this.errorCount = 0;
        this.errorLimit = 3;
    }

    random () {
        this.getApod(DateManager.randomDate());
    }

    specificDate (date) {
        this.getApod(date);
    }

    previous () {
        this.getApod(DateManager.adjacentDate(this.date, -1));
    }

    next () {
        this.getApod(DateManager.adjacentDate(this.date, 1));
    }

    current () {
        this.getApod();
    }

    fitToWindow (image) {
        return image.width > window.innerWidth || image.height > window.innerHeight;
    }

    _setLoadingView () {
        apodImage.style['background-image'] = '';
        apodImage.style['background-size'] = '';
        apodVideo.src = '';
        $('.apod__header .description').classList.add('hide');
        apodLoading.classList.remove('hide');
        apodKnowMore.innerHTML = '';
        drawer.closeDrawer();
        drawer.clearKnowMoreTabs();
    }

    isRequestValid () {
        if (this.isRequestInProgress) {
            return false;
        }

        this.isRequestInProgress = true;

        return this.isRequestInProgress;
    }

    getApod (date) {

        date = date || DateManager.today;

        if (!this.isRequestValid()) {
            console.log('Request in Progress!');
            return;
        }

        if (!DateManager.isDateValid(date)) {
            this.isRequestInProgress = false;
            return;
        }

        this._setLoadingView();

        reqwest({
            type: 'GET',
            url: 'https://api.nasa.gov/planetary/apod',
            data: {
                api_key: 'hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447',
                date: date,
            },
        }).then((response) => {
                response = JSON.parse(response.response);
                ga('send', 'event', 'APOD', 'viewed', response.date);
                this.title       = response.title;
                this.url         = response.url;
                this.hdurl       = response.hdurl;
                this.date        = response.date;
                this.description = response.explanation;
                this.errorCount = 0;
                this.checkFavorite();

                if (response.media_type === 'image') {
                    apodImage.style.display = 'block';
                    $('#apod-video').style.display = 'none';
                    this.preLoadImage();
                } else if (response.media_type === 'video') {
                    apodImage.style.display = 'none';
                    $('#apod-video').style.display = 'inline-block';
                    this.apodVideo();
                } else {
                    this.random();
                }

            }, (error) => {
                console.log('Error: APOD API response');
                this.errorCount++;
                this.isRequestInProgress = false;
                if (this.errorCount < this.errorLimit) {
                    this.random();
                } else {
                    apodError.textContent = 'NASA APOD Error: Please reload or try Again Later';
                }
            }
        );
    }

    checkFavorite () {
        const isFavorite = favoritesTab.favoriteDates.indexOf(this.date) > 0;

        if (isFavorite) {
            favoriteButtonShow.classList.remove('hide');
            favoriteButtonHide.classList.add('hide');
        } else {
            favoriteButtonShow.classList.add('hide');
            favoriteButtonHide.classList.remove('hide');
        }
    }

    highlightResults (result, index) {
        const re = new RegExp('\\b(' + result + ')\\b', 'gi');
        this.description = this.description.replace(re, `<span class="keyword keyword-${index}">$1</span>`);
    }

    wouldYouLikeToKnowMore (text) {
        const knowMore = new KnowMoreComponent(text);
        const results = knowMore.results;

        if (results.length) {
            for (let i in results) {
                this.highlightResults(results[i].title, i);
                knowMore.createTab(results[i], i);
            }
        }
    }

    preLoadImage () {
        let Img = new Image();
        let quality = {
            text: 'HD',
            title: 'High Definition Image'
        };
        const delayForHdLoad = 3000;

        Img.src = this.hdurl;

        let timeout = setTimeout(() => {
            if (!Img.complete) {
                Img.src = this.url;
                quality = {
                    text: 'SD',
                    title: 'Standard Definition Image'
                };
            }
        }, delayForHdLoad);

        Img.onload = () => {
            clearTimeout(timeout);
            this.loadedImage = Img;
            this.apodImage(quality);
        };

        Img.onerror = () => {
            clearTimeout(timeout);
            console.log('Error: image load');
            this.isRequestInProgress = false;
            this.random();
        };
    }

    apodImage (imgQuality) {
        this.isRequestInProgress = false;
        apodImage.style['background-image'] = 'url(' + this.loadedImage.src + ')';

        let bgSize = this.fitToWindow(this.loadedImage) ? 'contain' : 'auto';
        apodImage.style['background-size'] = bgSize;

        $('#img-quality').textContent = imgQuality.text;
        $('#img-quality').setAttribute('title', imgQuality.title);

        this.apodDescription();
    }

    apodVideo () {
        this.isRequestInProgress = false;
        apodVideo.src = this.url;
        this.apodDescription();
    }

    apodDescription () {
        apodTitle.textContent = this.title;
        apodDate.textContent = DateManager.prettyDateFormat(this.date);
        this.wouldYouLikeToKnowMore(this.title + ' ' + this.description);

        apodLoading.classList.add('hide');
        $('.apod__header .description').classList.remove('hide');
    }

    /**
     * Build filename for APOD site: ap170111.html
     *
     * @return {String} "2011-02-15"
     */
    apodSource () {
        const date = this.date.split('-');
        return 'ap' + date[0].slice(-2) + _zeroPad(date[1]) + _zeroPad(date[2]) + '.html';
    }
}
