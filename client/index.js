/**
 * Astronomy Picture of the Day - Chrome Extension
 * Author: Travis Lawrence
 * email: travis.lawrence12@gmail.com
 * website: redundantrobot.com
 *
 * An extension that makes the new tab page the APOD!
 * Utilizing the NASA API - https://api.nasa.gov/api.html#apod
 */

import Apod from './scripts/components/Apod';
import Drawer from './scripts/components/Drawer';
import ExplanationTab from './scripts/tabs/ExplanationTab';
import FavoritesTab from './scripts/tabs/FavoritesTab';
import topSites from './scripts/utils/buildTopSites';
import { $, randomizer, htmlToElements } from './scripts/utilities';
import { SunLoader, MoonLoader } from './scripts/SetupLoading';

import './styles/style.scss';

// Initialize apod and date objects
export const apod = new Apod();
export const loader = new [SunLoader, MoonLoader][(randomizer(1))]();

// Initialize drawer objects
export const drawer = new Drawer('#apod-drawer');
export const explanationTab = new ExplanationTab('#tab-explanation');
export const favoritesTab = new FavoritesTab('#tab-favorites');

// Create thumbnails and links for Top Sites
document.addEventListener('DOMContentLoaded', function() {
  topSites();
});

$('#apod-loading').appendChild(
  htmlToElements(`<div class='apod__loading' id='apod-loading'>${loader.render()}</div>`),
);

// Fetch chrome storage settings from options and load
chrome.storage.sync.get(['apodType', 'hiResOnly'], items => {
  if (items.hiResOnly) {
    apod.hiResOnly = true;
  }
  const apodOptionType = items.apodType || 'today';
  apodOptionType == 'today' ? apod.current() : apod.random();
});

chrome.storage.onChanged.addListener((changes, name) => {
  if (changes.hiResOnly) {
    window.location.reload();
  }
});
