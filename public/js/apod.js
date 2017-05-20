'use strict';

function _zeroPad (num) {
    num = '0' + num.toString();
    return num.slice(-2);
}

function setLoadingView () {
    apodImage.classList.add('loading');
    $('.description').classList.add('hide');

    let knowList = apodKnowMore.getElementsByTagName('li')
    for (let i = 0; i < 3; i++) {
        knowList[i].classList.add('hide');
        knowList[i].textContent = '';
    }
}

function Apod() {
    this.date;
    this.url;
    this.hdurl;
    this.title;
    this.description;
    this.copyright;
    this.DateManager = new DateManagement();
}

Apod.prototype = {

    random () {
        this.getApod(this.DateManager.randomDate());
    },

    previous () {
        this.getApod(this.DateManager.adjacentDate(this.date, -1));
    },

    next () {
        this.getApod(this.DateManager.adjacentDate(this.date, 1));
    },

    current () {
        this.getApod();
    },

    isRequestValid () {
        if (this.isRequestInProgress) {
            return false;
        }

        this.isRequestInProgress = true;

        return this.isRequestInProgress;
    },

    getApod (date) {

        date = date || this.DateManager.today;

        if (!this.isRequestValid()) {
            console.log('Request in Progress!');
            return;
        }

        if (!this.DateManager.isDateValid(date)) {
            this.isRequestInProgress = false;
            return;
        }

        setLoadingView();

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
                this.copyright   = response.copyright;

                this.wouldYouLikeToKnowMore(this.title + ' ' + this.description);

                switch (response.media_type) {
                    case 'image':
                        apodImage.style.display = 'block';
                        $('#apod-video').style.display = 'none';
                        this.preLoadImage();
                        break;
                    case 'video':
                        apodImage.style.display = 'none';
                        $('#apod-video').style.display = 'inline-block';
                        this.apodVideo();
                        break;
                    default:
                        this.errorImage();
                }
            }, (error) => {
                this.isRequestInProgress = false;
                this.getApod(this.DateManager.randomDate());
            }
        );
    },

    wouldYouLikeToKnowMore (text) {
        const knowMore = new KnowMore(text);
        const results = knowMore.results();

        if (results.length) {
            let list = apodKnowMore.getElementsByTagName('li');
            for (let i in results) {
                knowMore.search(results[i]).then((data) => {
                    let response = JSON.parse(data.response);
                    list[i].textContent = response.items[0].title;
                    list[i].classList.toggle('hide');
                }, (error) => {
                    console.log(JSON.parse(error.response).error.errors[0].message);
                });
            }
        }
    },

    errorImage () {
        let errorImg = new Image();
        errorImg.src = '/public/images/jupiter.jpg';
        
        errorImg.onload = () => {
            this.loadedImage = errorImg;
            this.apodImage();
        }
    },

    preLoadImage () {
        let Img = new Image();
        let quality = 'HD';
        const delayForHdLoad = 3000;

        Img.src = this.hdurl;

        let timeout = setTimeout(() => {
            if (!Img.complete) {
                Img.src = this.url;
                quality = 'SD';
            }
        }, delayForHdLoad);

        Img.onload = () => {
            clearTimeout(timeout);
            this.loadedImage = Img;
            this.apodImage(quality);
        };
    },

    apodImage (imgQuality) {
        this.isRequestInProgress = false;
        apodImage.style['background-image'] = 'url(' + this.loadedImage.src + ')';

        let bgSize = fitToWindow(this.loadedImage) ? 'contain' : 'auto';
        apodImage.style['background-size'] = bgSize;

        $('#img-quality').textContent = imgQuality;
        apodHiRes.setAttribute('href', this.hdurl);
        apodLowRes.setAttribute('href', this.url);

        this.apodDescription();
    },

    apodVideo () {
        this.isRequestInProgress = false;
        apodVideo.src = this.url;
        this.apodDescription();
    },

    apodDescription () {
        apodImage.classList.remove('loading');
        $('.description').classList.remove('hide');

        apodTitle.textContent = this.title;
        apodDate.textContent = this.DateManager.prettyDateFormat(this.date);
        apodDescription.textContent = this.description;
        apodOrigin.setAttribute('href', 'https://apod.nasa.gov/apod/' + this.apodSource());

        apodCopyright.textContent = this.copyright ? 'Copyright: ' + this.copyright : '';
    },

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
