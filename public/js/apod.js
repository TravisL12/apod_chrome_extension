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

        $.ajax({
            context: this,
            type: 'GET',
            url: 'https://api.nasa.gov/planetary/apod',
            data: {
                api_key: api_key,
                date: date,
            },
            success(response) {
                ga('send', 'event', 'APOD', 'viewed', response.date);
                this.title       = response.title;
                this.url         = response.url;
                this.hdurl       = response.hdurl;
                this.date        = response.date;
                this.explanation = response.explanation;
                this.copyright   = response.copyright;

                switch (response.media_type) {
                    case 'image':
                        apodImage.css('display', 'block');
                        $('#apod-video').css('display', 'none');
                        this.preLoadImage();
                        break;
                    case 'video':
                        this.validRequest = false;
                        apodImage.css('display', 'none');
                        $('#apod-video').css('display', 'inline-block');
                        this.apodVideo();
                        break;
                    default:
                        this.errorImage();
                }
            },
            error(error) {
                this.validRequest = false;
                this.getApod(this.DateManager.randomDate());
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
        apodImage.css('background-image', 'url(' + this.loadedImage.src + ')');

        let bgSize = fitToWindow(this.loadedImage) ? 'contain' : 'auto';
        apodImage.css('background-size', bgSize);

        $('#img-quality').text(imgQuality);
        apodHiRes.attr('href', this.hdurl);
        apodLowRes.attr('href', this.url);

        this.apodDescription();
    },

    apodVideo () {
        apodVideo[0].src = this.url;
        this.apodDescription();
    },

    apodDescription () {
        apodImage.removeClass('loading');
        $('.description').removeClass('hide');

        apodTitle.text(this.title);
        apodDate.text(this.DateManager.prettyDateFormat(this.date));
        apodDescription.text(this.explanation);
        apodOrigin.attr('href', 'https://apod.nasa.gov/apod/' + this.apodSource());

        if (this.copyright) {
            apodCopyright.text('Copyright: ' + this.copyright);
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
