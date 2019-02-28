/**
 * Astronomy Picture of the Day - Chrome Extension
 * Author: Travis Lawrence
 * email: travis.lawrence12@gmail.com
 * website: redundantrobot.com
 *
 * An extension that makes the new tab page the APOD!
 * Utilizing the NASA API - https://api.nasa.gov/api.html#apod
 */

import Apod from "./scripts/components/Apod";
import Drawer from "./scripts/components/Drawer";
import topSites from "./scripts/utilities/buildTopSites";
import { $ } from "./scripts/utilities/";
import ga from "./scripts/utilities/ga";
import { SunLoader, MoonLoader } from "./scripts/LoadingSpinner";
import ExplanationTab from "./scripts/tabs/ExplanationTab";
import FavoritesTab from "./scripts/tabs/FavoritesTab";

import "./styles/style.scss";

export const drawer = new Drawer("#apod-drawer");
const apod = new Apod();
const loader = new SunLoader();

$("#apod-loading").appendChild(loader.render());
drawer.tabs.push(
  new ExplanationTab("#tab-explanation"),
  new FavoritesTab("#tab-favorites")
);

document.addEventListener("DOMContentLoaded", function() {
  topSites();
});

chrome.storage.onChanged.addListener((changes, name) => {
  if (changes.hiResOnly) {
    apod.hiResOnly = changes.hiResOnly.newValue;
  }
});

// Fetch chrome storage settings from options and load
chrome.storage.sync.get(["apodType", "hiResOnly"], items => {
  if (items.hiResOnly) {
    apod.hiResOnly = true;
  }
  ga({ type: "pageview", category: "v2.3.2", page: "apod-by-trav" });
  const apodOptionType = items.apodType || "today";
  apodOptionType == "today" ? apod.current() : apod.random();
});
