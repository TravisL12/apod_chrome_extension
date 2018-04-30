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
import topSites from './scripts/utils/buildTopSites';
import LoadingSpinner from './scripts/LoadingSpinner';
import ExplanationTab from './scripts/tabs/ExplanationTab';
import FavoritesTab from './scripts/tabs/FavoritesTab';

import './styles/style.scss';

// Initialize apod and date objects
export const loader = new LoadingSpinner('#apod-loading');
export const drawer = new Drawer('#apod-drawer');
drawer.tabs.push(new ExplanationTab('#tab-explanation'),new FavoritesTab('#tab-favorites'));

export const apod = new Apod();

// Create thumbnails and links for Top Sites
document.addEventListener('DOMContentLoaded', function() {
  topSites();
});


chrome.storage.onChanged.addListener((changes, name) => {
  if (changes.hiResOnly) {
    apod.hiResOnly = changes.hiResOnly.newValue;
  }
});
