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
    apodCurrent     = $('.nav-buttons a#apod-current'),
    DateManager     = new DateManagement();

let apod = new Apod();

function fitToWindow (image) {
    return image.width > window.innerWidth || image.height > window.innerHeight;
}

function setLoadingView () {
    apodImage.addClass('loading');
    $('.description').addClass('hide');
    apodImage.css('background-image', 'none');
}

function blipHoverState (element, fn) {
    if (apod.requestInProgress) {
        return;
    }

    let delay = 125;
    element.addClass('hover');

    setTimeout(() => {
        element.removeClass('hover');
    }, delay);

    fn();
}

const apodActions = {
    random () {
        apod.getApod(DateManager.randomDate());
    },
    previous () {
        apod.getApod(DateManager.previousDate(apod.date));
    },
    next () {
        apod.getApod(DateManager.nextDate(apod.date));
    },
    current () {
        apod.getApod();
    },
}

// initial page load is random APOD
apodActions.random();

// RANDOM
apodRandom.on('click', function() {
    apodActions.random();
});

// CURRENT
apodCurrent.on('click', function() {
    apodActions.current();
});

// PREVIOUS
apodPrevious.on('click', function() {
    apodActions.previous();
});

// NEXT
apodNext.on('click', function() {
    apodActions.next();
});

$(document).on('keydown', function(e) {
    // RANDOM (r)
    if (e.which === 82) {
        blipHoverState(apodRandom, apodActions.random);
    }

    // CURRENT (t)
    if (e.which === 84) {
        blipHoverState(apodCurrent, apodActions.current);
    }

    // PREVIOUS (left arrow)
    if (e.which === 37) {
        blipHoverState(apodPrevious, apodActions.previous);
    }

    // NEXT (right arrow)
    if (e.which === 39) {
        blipHoverState(apodNext, apodActions.next);
    }

    // TOGGLE description (d)
    if (e.which === 68) {
        $('.container .description').toggleClass('show-description');
    }
})
