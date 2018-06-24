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
import { SunLoader, MoonLoader, CubeLoader } from './scripts/LoadingSpinner';
import ExplanationTab from './scripts/tabs/ExplanationTab';
import FavoritesTab from './scripts/tabs/FavoritesTab';
import { $, randomizer } from './scripts/utilities';

import './styles/style.scss';

export const loader = new SunLoader();
$('#apod-loading').appendChild(loader.render());

export const drawer = new Drawer('#apod-drawer');
drawer.tabs.push(new ExplanationTab('#tab-explanation'), new FavoritesTab('#tab-favorites'));

export const apod = new Apod();

document.addEventListener('DOMContentLoaded', function() {
  topSites();
});

chrome.storage.onChanged.addListener((changes, name) => {
  if (changes.hiResOnly) {
    apod.hiResOnly = changes.hiResOnly.newValue;
  }
});
