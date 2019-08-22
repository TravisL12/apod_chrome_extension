/*global chrome*/

import React from "react";
import ReactDOM from "react-dom";

import Apod from "./components/Apod";
// import topSites from "./scripts/utilities/buildTopSites";
// // import ga from "./scripts/utilities/ga";

import "./styles/style.scss";

// document.addEventListener("DOMContentLoaded", topSites);

// Fetch chrome storage settings from options and load
chrome.storage.sync.get(
  ["apodType", "hiResOnly"],
  ({ hiResOnly, apodType }) => {
    // ga({ type: "pageview", category: "v3.0.0", page: "apod-by-trav" });
    ReactDOM.render(
      <Apod selection={apodType} resolution={hiResOnly} />,
      document.getElementById("root")
    );
  }
);

// // import * as serviceWorker from './serviceWorker';
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
