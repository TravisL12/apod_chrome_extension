/**
 * Astronomy Picture of the Day - Chrome Extension
 * Author: Travis Lawrence
 * email: travis.lawrence12@gmail.com
 * website: redundantrobot.com
 *
 * An extension that makes the new tab page the APOD!
 * Utilizing the NASA API - https://api.nasa.gov/api.html#apod
 */

'use strict';

const api_key = 'hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447',
    apodApiUrl      = 'https://api.nasa.gov/planetary/apod',
    apodImage       = $('#apod-image'),
    apodTitle       = $('.container #apod-title'),
    apodCopyright   = $('.container #apod-copyright'),
    apodOrigin      = $('.container a#apod-origin'),
    apodHiRes       = $('.container a#apod-hires'),
    apodLowRes      = $('.container a#apod-lowres'),
    apodDescription = $('.container #apod-description'),
    apodRandom      = $('.nav-buttons button#apod-random'),
    apodCurrent     = $('.nav-buttons button#apod-current');

function Apod(date) {
    this.date = date;
    this.url;
    this.hdurl;
    this.title;
    this.explanation;
    this.date;
    this.copyright;
}

function fitToWindow (image) {
    let imageW = image.width,
        imageH = image.height,
        windowW = window.innerWidth,
        windowH = window.innerHeight;

    console.log('Image  - width: ' + imageW + ' height: ' + imageH);
    console.log('Window - width: ' + windowW + ' height: ' + windowH);
    console.log('------------------------------------');

    return (imageW > windowW || imageH > windowH);
}

function addLeadingZero (num) {
    if (num < 10) {
        return '0' + num.toString();
    } else {
        return num.toString();
    }
}

function randomDate () {
    let start = new Date(1995, 5, 16);
    let end = new Date();

    let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
}

Apod.prototype = {

    getApod: function (date) {
        apodTitle.text('Loading...');
        apodImage.addClass('loading');

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
                        _that.getApod(randomDate()); // for now
                }
            },
            error(error) {
                console.log('Error!');
                console.log(error);
                _that.getApod(randomDate());
            }
        });

    },

    preLoadImage: function () {
        let img = new Image();
        img.src = this.hdurl;
        img.onload = () => {
            apodImage.removeClass('loading');
            this.loadedImage = img;
            this.apodImage();
        };
    },

    apodImage: function () {
        apodImage.css('background-image', 'url(' + this.loadedImage.src + ')');
        
        if (fitToWindow(this.loadedImage)) {
            apodImage.css('background-size', 'contain');
        } else {
            apodImage.css('background-size', 'auto');
        }

        apodTitle.text(this.title + ' (' + this.date + ')');
        apodDescription.text(this.explanation);
        apodCopyright.text('Copyright: ' + this.copyright);
        apodOrigin.attr('href', 'https://apod.nasa.gov/apod/' + this.apodSource());
        apodHiRes.attr('href', this.hdurl);
        apodLowRes.attr('href', this.url);
    },

    // ap170111.html
    apodSource: function () {
        const date = new Date(this.date);
        return 'ap' + date.getYear().toString().slice(-2) + addLeadingZero(date.getMonth() + 1) + addLeadingZero(date.getDate()) + '.html';
    }
}

const apod = new Apod();
apod.getApod(randomDate());

apodRandom.on('click', function() {
    apod.getApod(randomDate());
});

apodCurrent.on('click', function() {
    apod.getApod();
});

// Press 'r' for random APOD
// Press 't' for today's APOD
$(document).on('keydown', function(e) {
    if (e.which === 82) { // 'r'
        apod.getApod(randomDate());
    }

    if (e.which === 84) { // 't'
        apod.getApod();
    }
})
