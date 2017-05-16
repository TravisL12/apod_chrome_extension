'use strict';

function addLeadingZero (num) {
    return num < 10 ? '0' + num.toString() : num.toString();
}

function Apod() {
    this.date;
    this.url;
    this.hdurl;
    this.title;
    this.explanation;
    this.copyright;
    this.validRequest = false;
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
        if (this.validRequest) {
            console.log('Request in Progress!');
            return false;
        }
        this.validRequest = true;

        return this.validRequest;
    },

    getApod (date) {

        date = date || this.DateManager.today;

        if (!this.isRequestValid()) {
            return;
        }

        if (!this.DateManager.isDateValid(date)) {
            this.validRequest = false;
            return;
        }
        setLoadingView();

        let _that = this;

        reqwest({
            type: 'GET',
            url: 'https://api.nasa.gov/planetary/apod',
            data: {
                api_key: api_key,
                date: date,
            },
            success(response) {
                response = JSON.parse(response.response);
                ga('send', 'event', 'APOD', 'viewed', response.date);
                _that.title       = response.title;
                _that.url         = response.url;
                _that.hdurl       = response.hdurl;
                _that.date        = response.date;
                _that.explanation = response.explanation;
                _that.copyright   = response.copyright;

                switch (response.media_type) {
                    case 'image':
                        apodImage.style.display = 'block';
                        $('#apod-video').style.display = 'none';
                        _that.preLoadImage();
                        break;
                    case 'video':
                        _that.validRequest = false;
                        apodImage.style.display = 'none';
                        $('#apod-video').style.display = 'inline-block';
                        _that.apodVideo();
                        break;
                    default:
                        _that.errorImage();
                }
            },
            error(error) {
                _that.validRequest = false;
                _that.getApod(this.DateManager.randomDate());
            }
        });

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
        let Img = new Image(),
            delayForHdLoad = 3000,
            quality = 'HD',
            timeout;

        Img.src = this.hdurl;

        Img.onload = () => {
            clearTimeout(timeout);
            this.loadedImage = Img;
            this.apodImage(quality);
        };

        timeout = setTimeout(() => {
            if (!Img.complete) {
                Img.src = this.url;
                quality = 'SD';
            }
        }, delayForHdLoad);
    },

    apodImage (imgQuality) {
        this.validRequest = false;
        apodImage.style['background-image'] = 'url(' + this.loadedImage.src + ')';

        let bgSize = fitToWindow(this.loadedImage) ? 'contain' : 'auto';
        apodImage.style['background-size'] = bgSize;

        $('#img-quality').textContent = imgQuality;
        apodHiRes.setAttribute('href', this.hdurl);
        apodLowRes.setAttribute('href', this.url);

        this.apodDescription();
    },

    apodVideo () {
        apodVideo.src = this.url;
        this.apodDescription();
    },

    apodDescription () {
        apodImage.classList.remove('loading');
        $('.description').classList.remove('hide');

        apodTitle.textContent = this.title;
        apodDate.textContent = this.DateManager.prettyDateFormat(this.date);
        apodDescription.textContent = this.explanation;
        apodOrigin.setAttribute('href', 'https://apod.nasa.gov/apod/' + this.apodSource());

        if (this.copyright) {
            apodCopyright.textContent = 'Copyright: ' + this.copyright;
        }
    },

    /**
     * Build filename for APOD site: ap170111.html
     *
     * @return {String} "2011-02-15"
     */
    apodSource () {
        const date = this.date.split('-');
        return 'ap' + date[0].slice(-2) + addLeadingZero(date[1]) + addLeadingZero(date[2]) + '.html';
    }
}
