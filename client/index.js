/**
 * Astronomy Picture of the Day - Chrome Extension
 * Author: Travis Lawrence
 * email: travis.lawrence12@gmail.com
 * website: redundantrobot.com
 *
 * An extension that makes the new tab page the APOD!
 * Utilizing the NASA API - https://api.nasa.gov/api.html#apod
 */

import NavigationButton from './scripts/NavigationButton';
import Apod from './scripts/components/Apod';
import { SunLoader, MoonLoader } from './scripts/SetupLoading';
import Drawer from './scripts/components/Drawer';
import ExplanationTab from './scripts/tabs/ExplanationTab';
import FavoritesTab from './scripts/tabs/FavoritesTab';
import DatePickerComponent from './scripts/components/DatePicker';
import { $, randomizer, htmlToElements } from './scripts/utilities';
import topSites from './scripts/utils/buildTopSites';

import './styles/style.scss';

// Initialize image & video elements
export const apodImage = $('#apod-image');
export const apodVideo = $('#apod-video iframe');

// Initialize various elements
export const apodTitle = $('#apod-title');
export const apodDate = $('#apod-date');
export const apodKnowMore = $('#know-more-tabs');
export const apodLoading = $('#apod-loading');
export const apodError = $('#apod-error');

// Initialize button objects
export const apodRandom = new NavigationButton('#apod-random', 82, 'random');
export const apodCurrent = new NavigationButton('#apod-current', 84, 'current');
export const apodPrevious = new NavigationButton('#apod-previous', 74, 'previous');
export const apodNext = new NavigationButton('#apod-next', 75, 'next');

export const favoriteButtonShow = $('#add-favorite .favorite');
export const favoriteButtonHide = $('#add-favorite .not-favorite');

// Initialize apod and date objects
export let apodDatePicker = null;
export const apod = new Apod();
export const loader = new [SunLoader, MoonLoader][(randomizer(1))]();
export const isFirefox = /firefox/gi.test(window.navigator.userAgent);

apodLoading.appendChild(
  htmlToElements(`<div class='apod__loading' id='apod-loading'>${loader.render()}</div>`),
);

// Initialize drawer objects
export const drawer = new Drawer('#apod-drawer');
export const explanationTab = new ExplanationTab('#tab-explanation');
export const favoritesTab = new FavoritesTab('#tab-favorites');

// Fetch chrome storage settings from options and load
chrome.storage.sync.get(['apodType', 'showDatePicker'], items => {
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
});

// Create thumbnails and links for Top Sites
document.addEventListener('DOMContentLoaded', function() {
  topSites('topSites');
});
