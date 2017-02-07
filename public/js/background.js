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
    apodImage       = $('#apod-image'),
    apodTitle       = $('.container #apod-title'),
    apodDate        = $('.container #apod-date'),
    apodDescription = $('.container #apod-description'),
    apodCopyright   = $('.container #apod-copyright'),
    apodOrigin      = $('.container a#apod-origin'),
    apodHiRes       = $('.container a#apod-hires'),
    apodLowRes      = $('.container a#apod-lowres'),
    apodPrevious    = $('.nav-buttons a#apod-previous'),
    apodNext        = $('.nav-buttons a#apod-next'),
    apodCurrent     = $('.nav-buttons a#apod-current'),
    apodRandom      = $('.nav-buttons a#apod-random'),
    DateManager     = new DateManagement();

let apod = new Apod();

function fitToWindow (image) {
    return image.width > window.innerWidth || image.height > window.innerHeight;
}

function setLoadingView () {
    apodImage.addClass('loading');
    $('.description').addClass('hide');
    $('.external-links').removeClass('highlight-resolution');
    apodCopyright.text('');
    apodImage.css('background-image', 'none');
}

function blipHoverState (element, apodFn) {
    if (apod.requestInProgress) {
        return;
    }

    let delay = 125;
    element.addClass('hover');

    setTimeout(() => {
        element.removeClass('hover');
    }, delay);

    apodFn();
}

const apodActions = {
    random () {
        apod.getApod(DateManager.randomDate());
    },
    previous () {
        apod.getApod(DateManager.adjacentDate(apod.date, -1));
    },
    next () {
        apod.getApod(DateManager.adjacentDate(apod.date, 1));
    },
    current () {
        apod.getApod();
    },
}

// initial page load is random APOD
apodActions.random();

$('.nav-buttons').on('click', (e) => {
    apodActions[e.target.id.slice(5)]();
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
