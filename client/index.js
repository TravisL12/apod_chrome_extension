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
import { SunLoader } from './scripts/SetupLoading';
import { MoonLoader } from './scripts/SetupLoading';
import Drawer from './scripts/components/Drawer';
import ExplanationTab from './scripts/tabs/ExplanationTab';
import FavoritesTab from './scripts/tabs/FavoritesTab';
import DatePickerComponent from './scripts/components/DatePicker';
import DateManagement from './scripts/DateManagement';
import { $, randomizer, htmlToElements } from './scripts/utilities';

require('./styles/style.scss');

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
const apodPrevious = new NavigationButton('#apod-previous', 74, 'previous');
const apodNext = new NavigationButton('#apod-next', 75, 'next');

const favoriteButtonShow = $('#add-favorite .favorite');
const favoriteButtonHide = $('#add-favorite .not-favorite');

// Initialize apod and date objects
let apodDatePicker = null;
const DateManager = DateManagement();
const apod = new Apod();
const loader = new [SunLoader, MoonLoader][(randomizer(1))]();
const isFirefox = /firefox/gi.test(window.navigator.userAgent);

apodLoading.appendChild(
  htmlToElements(`<div class='apod__loading' id='apod-loading'>${loader.render()}</div>`),
);

// Initialize drawer objects
const drawer = new Drawer('#apod-drawer');
const explanationTab = new ExplanationTab('#tab-explanation', apod, drawer);
const favoritesTab = new FavoritesTab('#tab-favorites', apod, drawer);

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
