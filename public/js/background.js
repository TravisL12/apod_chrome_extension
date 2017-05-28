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

const $ = (el) => {
    return document.querySelector(el);
}

const apodImage       = $('#apod-image'),
      apodVideo       = $('#apod-video iframe'),
      apodTitle       = $('#apod-title'),
      apodDate        = $('#apod-date'),
      apodDescription = $('#apod-description'),
      apodOrigin      = $('#apod-origin'),
      apodHiRes       = $('#apod-hires'),
      apodLowRes      = $('#apod-lowres'),
      apodLoading     = $('#apod-loading'),
      apodPrevious    = $('#apod-previous'),
      apodNext        = $('#apod-next'),
      apodCurrent     = $('#apod-current'),
      apodKnowMore    = $('#want-to-know-more ul'),
      apodRandom      = $('#apod-random');

function buildRays(num) {
  let rays = '';
  for(let i = 0; i < num; i++) {
    rays += "<div class='ray'></div>";
  }
  return rays;
}

$('#big-rays').innerHTML   = buildRays(20);
$('#small-rays').innerHTML = buildRays(20);

function fitToWindow (image) {
    return image.width > window.innerWidth || image.height > window.innerHeight;
}

function blipHoverState (element, apodFn) {
    if (apod.isRequestInProgress) {
        return;
    }
    ga('send', 'event', 'Keydown', 'pressed', element.id);
    const delay = 125;
    element.classList.add('hover');

    setTimeout(() => {
        element.classList.remove('hover');
    }, delay);

    apodFn.call(apod);
}

$('.nav-buttons').addEventListener('click', (e) => {
    ga('send', 'event', 'Button', 'clicked', e.target.id);
    apod[e.target.id.slice(5)]();
});

$('.external-links').addEventListener('click', (e) => {
    ga('send', 'event', {
        eventCategory: 'Outbound Link',
        eventAction: 'clicked',
        eventLabel: event.target.id,
        transport: 'beacon'
    });
});

document.addEventListener('keydown', function(e) {
    switch (e.which) {
        case 82: // Press 'r'
            blipHoverState(apodRandom, apod.random);
            break;
        case 84: // Press 't'
            blipHoverState(apodCurrent, apod.current);
            break;
        case 74: // Press 'J'
        case 37: // Press '<-'
            blipHoverState(apodPrevious, apod.previous);
            break;
        case 75: // Press 'K'
        case 39: // Press '->'
            blipHoverState(apodNext, apod.next);
            break;
        case 68: // Press 'D'
            $('.apod__description .description').classList.toggle('show-description');
            break;
    }
})

let apod = new Apod();

chrome.storage.sync.get(['apodType'], (items) => {
    let apodOptionType = items.apodType || 'today';
    // apodOptionType == 'today' ? apod.current() : apod.random();
});
