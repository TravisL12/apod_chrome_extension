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

const apodImage       = $('#apod-image'),
      apodVideo       = $('#apod-video iframe'),
      apodTitle       = $('#apod-title'),
      apodDate        = $('#apod-date'),
      apodDescription = $('#apod-description'),
      apodDrawer      = $('#apod-drawer'),
      apodDrawerBtn   = $('#apod-drawerToggle'),
      apodOrigin      = $('#apod-origin'),
      apodHiRes       = $('#apod-hires'),
      apodLowRes      = $('#apod-lowres'),
      apodLoading     = $('#apod-loading'),
      apodPrevious    = $('#apod-previous'),
      apodNext        = $('#apod-next'),
      apodCurrent     = $('#apod-current'),
      apodKnowMore    = $('#want-to-know-more ul'),
      apodRandom      = $('#apod-random');

const loaders = [SunLoader, MoonLoader];
const loader = new loaders[randomizer(1)];

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

function renderDrawer (apods) {
    let favoritesEl = '';

    for (let apod in apods) {
        let backgroundImage = 'background-image: url("' + apods[apod].imgUrl + '")';

        favoritesEl += `<li class='favorite'>
            <div class='favorite__image' style='${backgroundImage}'></div>
            <h4 class='favorite__title'>${apods[apod].title}</h4>
        </li>`;
    }

    $('.apod__drawer-view #drawer-list').innerHTML = favoritesEl;
}

function toggleDrawer (e) {
    getFavorites((favorites) => {
        renderDrawer(favorites.apodFavorites);

        apodDrawer.classList.toggle('show');
    });
}

function getFavorites (callback) {
    chrome.storage.sync.get(['apodFavorites'], callback);
}

function saveFavorite () {

    getFavorites((favorites) => {
        favorites = favorites.apodFavorites || {};

        favorites[apod.date] = {
            title: apod.title,
            imgUrl: apod.url,
        };

        chrome.storage.sync.set({
            apodFavorites: favorites,
        });
    });

}

apodDrawerBtn.addEventListener('click', toggleDrawer);

$('.nav-buttons').addEventListener('click', (e) => {
    if (e.target.id !== 'add-favorite') {
        ga('send', 'event', 'Button', 'clicked', e.target.id);
        apod[e.target.id.slice(5)]();
    } else {
        saveFavorite();
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
        case 69: // Press 'E'
            $('.apod__description .description').classList.toggle('show-description');
            break;
        case 68: // Press 'D'
            toggleDrawer(e);
            break;
    }
})

let apod = new Apod();

chrome.storage.sync.get(['apodType'], (items) => {
    let apodOptionType = items.apodType || 'today';
    apodOptionType == 'today' ? apod.current() : apod.random();
});
