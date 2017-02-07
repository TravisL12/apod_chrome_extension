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

    isRequestValid () {
        if (this.validRequest) {
            console.log('Request in Progress!');
            return false;
        }
        this.validRequest = true;

        return this.validRequest;
    },

    getApod (date) {

        date = '2017-02-01';//date || DateManager.today;

        if (!this.isRequestValid()) {
            return;
        }

        if (!DateManager.isDateValid(date)) {
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
                    case 'video':
                        this.apodVideo();
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

    apodImage (imgQuality) {
        this.validRequest = false;

        apodImage.css('background-image', 'url(' + this.loadedImage.src + ')');
        apodImage.removeClass('loading');

        if (fitToWindow(this.loadedImage)) {
            apodImage.css('background-size', 'contain');
        } else {
            apodImage.css('background-size', 'auto');
        }

        $('#apod-'+imgQuality).addClass('highlight-resolution');
        apodHiRes.attr('href', this.hdurl);
        apodLowRes.attr('href', this.url);

        this.apodDescription();
    },

    apodVideo () {
        let iFrame = document.createElement('iframe');
        iFrame.src = this.url;
        apodVideo.append(iFrame);
        apodImage.removeClass('loading');

        this.apodDescription();
    },

    apodDescription () {
        $('.description').removeClass('hide');
        apodDate.text(DateManager.prettyDateFormat(this.date));
        apodTitle.text(this.title);
        apodDescription.text(this.explanation);
        apodOrigin.attr('href', 'https://apod.nasa.gov/apod/' + this.apodSource());
        if (this.copyright) {
            apodCopyright.text('Copyright: ' + this.copyright);
        }
    },

    // Build filename: ap170111.html
    // 2011-02-15
    apodSource () {
        const date = this.date.split('-');
        return 'ap' + date[0].slice(-2) + date[1] + date[2] + '.html';
    }
}
