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
    apodVideo       = $('#apod-video iframe'),
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
    apodRandom      = $('.nav-buttons a#apod-random');

function fitToWindow (image) {
    return image.width > window.innerWidth || image.height > window.innerHeight;
}

function setLoadingView () {
    apodImage.addClass('loading');
    $('.description').addClass('hide');
    apodCopyright.text('');
    apodImage.css('background-image', 'none');
}

function blipHoverState (element, apodFn) {
    if (apod.requestInProgress) {
        return;
    }
    ga('send', 'event', 'Keydown', 'pressed', element.id);
    let delay = 125;
    element.addClass('hover');

    setTimeout(() => {
        element.removeClass('hover');
    }, delay);

    apodFn.call(apod);
}

$('.nav-buttons').on('click', (e) => {
    ga('send', 'event', 'Button', 'clicked', e.target.id);
    apod[e.target.id.slice(5)]();
});

$('.external-links').on('click', (e) => {
    ga('send', 'event', {
        eventCategory: 'Outbound Link',
        eventAction: 'clicked',
        eventLabel: event.target.id,
        transport: 'beacon'
    });
});

$(document).on('keydown', function(e) {
    switch (e.which) {
        case 82:
            blipHoverState(apodRandom, apod.random);
            break;
        case 84:
            blipHoverState(apodCurrent, apod.current);
            break;
        case 37:
            blipHoverState(apodPrevious, apod.previous);
            break;
        case 39:
            blipHoverState(apodNext, apod.next);
            break;
        case 68:
            $('.container .description').toggleClass('show-description');
            break;
    }
})

let apod = new Apod();
chrome.storage.sync.get(['apodType'], (items) => {
    let apodOptionType = items.apodType || 'today';
    apodOptionType == 'today' ? apod.current() : apod.random();
});
