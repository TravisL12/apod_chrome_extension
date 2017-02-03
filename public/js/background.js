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
    apodDate        = $('.container #apod-date'),
    apodRandom      = $('.nav-buttons a#apod-random'),
    apodPrevious    = $('.nav-buttons a#apod-previous'),
    apodNext        = $('.nav-buttons a#apod-next'),
    apodCurrent     = $('.nav-buttons a#apod-current');

const monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

function actualDate (date) {
    let split = date.split('-');
    return new Date(split[0], split[1]-1, split[2]);
}

function prettyDateFormat (date) {
    let thisDate = actualDate(date);
    return monthNames[thisDate.getMonth()] + ' ' + thisDate.getDate() + ', ' + thisDate.getFullYear();
}

function fitToWindow (image) {
    return image.width > window.innerWidth || image.height > window.innerHeight;
}

function addLeadingZero (num) {
    return num < 10 ? '0' + num.toString() : num.toString();
}

function hyphenDateFormat (date) {
    date = date || new Date();
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'); 
}

function previousDate (dateString) {
    let date = actualDate(dateString);
    let yesterday = new Date(date.getTime());
    yesterday = new Date(yesterday.setDate(yesterday.getDate() - 1));
    return hyphenDateFormat(yesterday);
}

function nextDate (dateString) {
    let date = actualDate(dateString);
    let tomorrow = new Date(date.getTime());
    tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));
    return hyphenDateFormat(tomorrow);
}

function randomDate () {
    let start = new Date(1995, 5, 16);
    let end = new Date();

    let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return hyphenDateFormat(date);
}

function setLoadingView () {
    apodImage.addClass('loading');
    $('.description').addClass('hide');
    apodImage.css('background-image', 'none');
}

function checkDate (date) {
    let today = actualDate(hyphenDateFormat());
    return today >= actualDate(date);
}

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
            if (!checkDate(date)) {
                console.warn(date + ' is in the future!');
                return;
            }
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
                _that.getApod(randomDate());
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

        apodDate.text(prettyDateFormat(this.date));
        apodTitle.text(this.title);
        apodDescription.text(this.explanation);
        apodCopyright.text('Copyright: ' + this.copyright);
        apodOrigin.attr('href', 'https://apod.nasa.gov/apod/' + this.apodSource());
        apodHiRes.attr('href', this.hdurl);
        apodLowRes.attr('href', this.url);
    },

    // Build filename: ap170111.html
    apodSource: function () {
        const date = actualDate(this.date);
        return 'ap' + date.getYear().toString().slice(-2) + addLeadingZero(date.getMonth() + 1) + addLeadingZero(date.getDate()) + '.html';
    }
}

const apod = new Apod();
apod.getApod(randomDate());

apodRandom.on('click', function() {
    apod.getApod(randomDate());
});

apodPrevious.on('click', function() {
    apod.getApod(previousDate(apod.date));
});

apodNext.on('click', function() {
    apod.getApod(nextDate(apod.date));
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

    if (e.which === 37) { // left arrow for previous APOD
        apod.getApod(previousDate(apod.date));
    }

    if (e.which === 39) { // right arrow for next APOD
        apod.getApod(nextDate(apod.date));
    }

    if (e.which === 68) { // Press 'd' to toggle description
        $('.container .description').toggleClass('show-description');
    }
})
