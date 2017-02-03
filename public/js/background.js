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

function fitToWindow (image) {
    return image.width > window.innerWidth || image.height > window.innerHeight;
}

function addLeadingZero (num) {
    return num < 10 ? '0' + num.toString() : num.toString();
}

function randomDate () {
    let start = new Date(1995, 5, 16);
    let end = new Date();

    let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
}

function setLoadingView () {
    apodImage.addClass('loading');
    apodTitle.text('Loading...');
    apodDescription.text('');
    apodCopyright.text('');
    apodImage.css('background-image', 'none');
}

function Apod(date) {
    this.date = date;
    this.url;
    this.hdurl;
    this.title;
    this.explanation;
    this.date;
    this.copyright;
}

Apod.prototype = {

    getApod: function (date) {
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
                        _that.getApod(randomDate()); // for now
                }
            },
            error(error) {
                _that.getApod(randomDate());
            }
        });

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
        apodImage.removeClass('loading');

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

    // Build filename: ap170111.html
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

$(document).on('keydown', function(e) {
    if (e.which === 82) { // Press 'r' for random APOD
        apod.getApod(randomDate());
    }

    if (e.which === 84) { // Press 't' for today's APOD
        apod.getApod();
    }

    if (e.which === 68) { // Press 'd' to toggle description
        $('.container .description').toggleClass('show-description');
    }
})
