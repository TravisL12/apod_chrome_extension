'use strict';

function Apod() {
    this.date;
    this.url;
    this.hdurl;
    this.title;
    this.explanation;
    this.copyright;
    this.requestInProgress = false;
}

Apod.prototype = {

    allowRequest: function (date) {
        if (this.requestInProgress) {
            console.log('Request in Progress!');
            return false;
        }

        if (date) {
            if (!DateManager.checkDate(date)) {
                console.log(date + ' is in the future!');
                return false;
            }
        } else {
            apodNext.addClass('hide');
        }

        this.requestInProgress = true;

        return this.requestInProgress;
    },

    getApod: function (date) {
        if (!this.allowRequest(date)) {
            return;
        }

        setLoadingView();
        date = date || '';

        $.ajax({
            context: this,
            type: 'GET',
            url: apodApiUrl,
            data: {
                api_key: api_key,
                date: date,
            },
            success(response) {
                this.title       = response.title;
                this.url         = response.url;
                this.hdurl       = response.hdurl;
                this.date        = response.date;
                this.explanation = response.explanation;
                this.copyright   = response.copyright;

                switch (response.media_type) {
                    case 'image':
                        this.preLoadImage();
                        break;
                    default:
                        this.errorImage();
                }
            },
            error(error) {
                this.requestInProgress = false;
                this.getApod(DateManager.randomDate());
            }
        });

    },

    errorImage: function () {
        let errorImg = new Image();
        errorImg.src = '/public/images/jupiter.jpg';
        
        errorImg.onload = () => {
            this.loadedImage = errorImg;
            this.apodImage();
        }
    },

    preLoadImage: function () {
        let hdImg = new Image(),
            sdImg = new Image(),
            delayForHdLoad = 3000,
            timeout;

        hdImg.src = this.hdurl;
        sdImg.src = this.url;

        sdImg.onload = () => {
            this.loadedImage = sdImg;

            timeout = setTimeout((e) => {
                hdImg.onload = null;
                this.apodImage();
            }, delayForHdLoad);
        };

        hdImg.onload = () => {
            sdImg.onload = null;
            clearTimeout(timeout);
            this.loadedImage = hdImg;
            this.apodImage();
        };
    },

    apodImage: function () {
        this.requestInProgress = false;

        apodImage.css('background-image', 'url(' + this.loadedImage.src + ')');
        $('.description').removeClass('hide');
        apodImage.removeClass('loading');

        if (fitToWindow(this.loadedImage)) {
            apodImage.css('background-size', 'contain');
        } else {
            apodImage.css('background-size', 'auto');
        }

        apodDate.text(DateManager.prettyDateFormat(this.date));
        apodTitle.text(this.title);
        apodDescription.text(this.explanation);
        apodCopyright.text('Copyright: ' + this.copyright);
        apodOrigin.attr('href', 'https://apod.nasa.gov/apod/' + this.apodSource());
        apodHiRes.attr('href', this.hdurl);
        apodLowRes.attr('href', this.url);
    },

    // Build filename: ap170111.html
    apodSource: function () {
        const date = DateManager.actualDate(this.date);
        return 'ap' + date.getYear().toString().slice(-2) + addLeadingZero(date.getMonth() + 1) + addLeadingZero(date.getDate()) + '.html';
    }
}
