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

/* Randomizer */
function randomizer(max, min) {
    min = min || 0;
    max = max || 1;

    return Math.round(Math.random() * (max - min) + min);
}

/* Zero pad dates */
function _zeroPad (num) {
    num = '0' + num.toString();
    return num.slice(-2);
}

/* Query selector shortcut (mimic jQuery) */
const $ = (el) => {
    return document.querySelector(el);
}

/* Alternative to innerHTML */
function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}

// Initialize image & video elements
const apodImage = $('#apod-image');
const apodVideo = $('#apod-video iframe');

// Initialize various elements
const apodTitle = $('#apod-title');
const apodDate = $('#apod-date');
const apodKnowMore = $('#know-more-tabs');
const apodLoading = $('#apod-loading');
const apodError = $('#apod-error');

// Initialize button objects
const apodRandom = new NavigationButton('#apod-random', 82, 'random');
const apodCurrent = new NavigationButton('#apod-current', 84, 'current');
const favoriteButtonShow = $('#add-favorite .favorite');
const favoriteButtonHide = $('#add-favorite .not-favorite');

// Initialize apod and date objects
let apodDatePicker = null;
const DateManager = DateManagement();
const apod = new Apod();
const loader = new [SunLoader, MoonLoader][randomizer(1)];
const isFirefox = /firefox/ig.test(window.navigator.userAgent);

apodLoading.appendChild(htmlToElements(`<div class='apod__loading' id='apod-loading'>${loader.render()}</div>`));

// Initialize drawer objects
const drawer = new Drawer('#apod-drawer');
const explanationTab = new ExplanationTab('#tab-explanation', apod, drawer);
const favoritesTab = new FavoritesTab('#tab-favorites', apod, drawer);

// Fetch chrome storage settings from options and load
chrome.storage.sync.get(['apodType', 'showDatePicker'], (items) => {
    if (items.showDatePicker) {
        $('#apod-date-picker').classList.remove('hide');
        apodDatePicker = new DatePickerComponent('#apod-date-picker');
        apod.showDatePicker = true;
    }
    let apodOptionType = items.apodType || 'today';
    apodOptionType == 'today' ? apod.current() : apod.random();
});

chrome.storage.onChanged.addListener((changes, name) => {
    if (changes.showDatePicker) {
        window.location.reload();
    }
})
