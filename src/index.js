/*global chrome*/

import React from "react";
import ReactDOM from "react-dom";

// import * as serviceWorker from "./serviceWorker";
import Apod from "./components/Apod";
import ga from "./utilities/ga";

import "./styles/style.scss";

// Fetch chrome storage settings from options and load
chrome.storage.sync.get(
  ["apodType", "hiResOnly"],
  ({ hiResOnly, apodType }) => {
    ga({ type: "pageview", category: "v3.0.0", page: "apod-by-trav" });
    ReactDOM.render(
      <Apod selection={apodType} isHighRes={hiResOnly} />,
      document.getElementById("root")
    );
  }
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
