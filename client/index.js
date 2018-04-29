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
import { $, randomizer, htmlToElements } from './scripts/utilities';
import { SunLoader, MoonLoader, CubeLoader } from './scripts/SetupLoading';

import './styles/style.scss';

// Initialize apod and date objects
export const drawer = new Drawer('#apod-drawer');
export const apod = new Apod();
export const loader = new [SunLoader, MoonLoader, CubeLoader][(randomizer(2))]();

// Create thumbnails and links for Top Sites
document.addEventListener('DOMContentLoaded', function() {
  topSites();
});

$('#apod-loading').appendChild(
  htmlToElements(`${loader.render()}`),
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
