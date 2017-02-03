function Apod() {
    this.date;
    this.url;
    this.hdurl;
    this.title;
    this.explanation;
    this.copyright;
}

Apod.prototype = {

    getApod: function (date) {
        if (date) {
            if (!DateManager.checkDate(date)) {
                console.warn(date + ' is in the future!');
                return;
            }
        } else {
            apodNext.addClass('hide');
        }

        setLoadingView();
        date = date || '';

        const _that = this,
        data = {
            api_key: api_key,
            date: date
        };

        $.ajax({
            type: 'GET',
            url: apodApiUrl,
            data: data,
            success(response) {
                _that.title       = response.title;
                _that.url         = response.url;
                _that.hdurl       = response.hdurl;
                _that.date        = response.date;
                _that.explanation = response.explanation;
                _that.copyright   = response.copyright;

                switch (response.media_type) {
                    case 'image':
                        _that.preLoadImage();
                        break;
                    default:
                        _that.errorImage();
                }
            },
            error(error) {
                _that.getApod(DateManager.randomDate());
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
