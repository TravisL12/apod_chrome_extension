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

function randomizer(max, min) {
    min = min || 0;
    max = max || 1;

    return Math.round(Math.random() * (max - min) + min);
}

const $ = (el) => {
    return document.querySelector(el);
}

const apodImage       = $('#apod-image');
const apodVideo       = $('#apod-video iframe');

const apodTitle       = $('#apod-title');
const apodDate        = $('#apod-date');
const apodDescription = $('#apod-description');

const apodDrawer      = $('#apod-drawer');
const favoritesBtn    = $('#tab-favorites');
const explanationBtn  = $('#tab-explanation');
const knowMoreBtn     = $('#tab-know-more');
const apodKnowMore    = $('#want-to-know-more ul');

const apodOrigin      = $('#apod-origin');
const apodHiRes       = $('#apod-hires');
const apodLowRes      = $('#apod-lowres');

const apodLoading     = $('#apod-loading');
const apodPrevious    = $('#apod-previous');
const apodNext        = $('#apod-next');
const apodCurrent     = $('#apod-current');
const apodRandom      = $('#apod-random');

const apod = new Apod();
const drawer = new Drawer(apodDrawer);
const loaders = [SunLoader, MoonLoader];
const loader = new loaders[randomizer(1)];

const favoritesTab   = new FavoritesTab(favoritesBtn, apod, drawer);
const explanationTab = new ExplanationTab(explanationBtn, apod, drawer);
const knowMoreTab    = new KnowMoreTab(knowMoreBtn, apod, drawer);

apodLoading.innerHTML = loader.render();

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
    if (e.target.id !== 'add-favorite') {
        ga('send', 'event', 'Button', 'clicked', e.target.id);
        apod[e.target.id.slice(5)]();
    } else {
        favoritesTab.save();
    }
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
            $('.apod__footer .description').classList.toggle('show-description');
            break;
    }
})

chrome.storage.sync.get(['apodType'], (items) => {
    let apodOptionType = items.apodType || 'today';
    apodOptionType == 'today' ? apod.current() : apod.random();
});
