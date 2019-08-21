/**
 * Astronomy Picture of the Day - Chrome Extension
 * Author: Travis Lawrence
 * email: travis.lawrence12@gmail.com
 * website: redundantrobot.com
 *
 * An extension that makes the new tab page the APOD!
 * Utilizing the NASA API - https://api.nasa.gov/api.html#apod
 */

import React from "react";
import ReactDOM from "react-dom";
import Apod from "./scripts/components/Apod";
import topSites from "./scripts/utilities/buildTopSites";
import ga from "./scripts/utilities/ga";

import "styles/style.scss";

const apod = new Apod();

document.addEventListener("DOMContentLoaded", topSites);

chrome.storage.onChanged.addListener((changes, name) => {
  if (changes.hiResOnly) {
    apod.hiResOnly = changes.hiResOnly.newValue;
  }
});

// Fetch chrome storage settings from options and load
chrome.storage.sync.get(
  ["apodType", "hiResOnly"],
  ({ hiResOnly, apodType }) => {
    ga({ type: "pageview", category: "v2.3.2", page: "apod-by-trav" });
    apod.hiResOnly = hiResOnly;
    apodType === "today" ? apod.current() : apod.random();
    ReactDOM.render(
      <Apod selection={apodType} />,
      document.getElementById("root")
    );
  }
);
