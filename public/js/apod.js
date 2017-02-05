'use strict';

function Apod() {
    this.date;
    this.url;
    this.hdurl;
    this.title;
    this.explanation;
    this.copyright;
    this.validRequest = false;
}

Apod.prototype = {

    isRequestValid: function (date) {
        if (this.validRequest) {
            console.log('Request in Progress!');
            return false;
        }
        this.validRequest = true;

        if (date) {
            if (!DateManager.checkDate(date)) {
                console.log(date + ' is in the future!');
                return false;
            }
        } else {
            apodNext.addClass('hide');
        }

        return true;
    },

    getApod: function (date) {

        if (!this.isRequestValid(date)) {
            return;
        }

        setLoadingView();
        date = date || DateManager.today;

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
                this.validRequest = false;
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
        let Img = new Image(),
            delayForHdLoad = 3000,
            quality = 'hires',
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
                quality = 'lowres';
            }
        }, delayForHdLoad);
    },

    apodImage: function (imgQuality) {
        this.validRequest = false;

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
        $('#apod-'+imgQuality).addClass('highlight');
        apodDescription.text(this.explanation);
        apodOrigin.attr('href', 'https://apod.nasa.gov/apod/' + this.apodSource());
        apodHiRes.attr('href', this.hdurl);
        apodLowRes.attr('href', this.url);
        if (this.copyright) {
            apodCopyright.text('Copyright: ' + this.copyright);
        }
    },

    // Build filename: ap170111.html
    // 2011-02-15
    apodSource: function () {
        const date = this.date.split('-');
        return 'ap' + date[0].slice(-2) + date[1] + date[2] + '.html';
    }
}
