/*global chrome*/
import React, { Component } from "react";
import ReactDOM from "react-dom";

// import * as serviceWorker from "./serviceWorker";
import Apod from "./components/Apod";
import ga from "./utilities/ga";

import "./styles/style.scss";
import "react-datepicker/dist/react-datepicker.css";

class App extends Component {
  state = this.props;

  componentDidMount() {
    chrome.storage.onChanged.addListener(changes => {
      const updatedSettings = Object.keys(changes).reduce((result, setting) => {
        result[setting] = changes[setting].newValue;
        return result;
      }, this.state);

      this.setState(updatedSettings);
    });
  }

  render() {
    const { apodType, apodFavorites, hiResOnly } = this.state;

    return (
      <Apod
        selection={apodType}
        favorites={apodFavorites}
        isHighRes={hiResOnly}
      />
    );
  }
}

// Fetch chrome storage settings from options and load
chrome.storage.sync.get(
  ["apodType", "hiResOnly", "apodFavorites"],
  ({ hiResOnly, apodType, apodFavorites }) => {
    ga({ type: "pageview", category: "v3.0.0", page: "apod-by-trav" });
    ReactDOM.render(
      <App
        apodType={apodType}
        apodFavorites={apodFavorites}
        hiResOnly={hiResOnly}
      />,
      document.getElementById("root")
    );
  }
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
