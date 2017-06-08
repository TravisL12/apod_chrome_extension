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

function _zeroPad (num) {
    num = '0' + num.toString();
    return num.slice(-2);
}

const $ = (el) => {
    return document.querySelector(el);
}

const apodImage = $('#apod-image');
const apodVideo = $('#apod-video iframe');

const apodTitle = $('#apod-title');
const apodDate = $('#apod-date');
const apodKnowMore = $('#want-to-know-more ul');
const apodLoading = $('#apod-loading');

const apodRandom = new NavigationButton('#apod-random', 82, 'random');
const apodCurrent = new NavigationButton('#apod-current', 84, 'current');
const apodPrevious = new NavigationButton('#apod-previous', 74, 'previous');
const apodNext = new NavigationButton('#apod-next', 75, 'next');

const DateManager = DateManagement();
const apod = new Apod();
const loader = new [SunLoader, MoonLoader][randomizer(1)];

apodLoading.innerHTML = loader.render();

const drawer = new Drawer('#apod-drawer');
const explanationTab = new ExplanationTab('#tab-explanation', apod, drawer);
const favoritesTab   = new FavoritesTab('#tab-favorites', apod, drawer);

chrome.storage.sync.get(['apodType'], (items) => {
    let apodOptionType = items.apodType || 'today';
    apodOptionType == 'today' ? apod.current() : apod.random();
});
