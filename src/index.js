/*global chrome*/
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { shape, bool, string, object } from "prop-types";

import * as serviceWorker from "./serviceWorker";
import Apod from "./components/Apod";
import ga from "./utilities/ga";
import "./styles/style.scss";
import { manifest } from "./utilities";

export default class App extends Component {
  static propTypes = {
    options: shape({
      apodType: string,
      apodFavorites: object,
      hiResOnly: bool,
      showTopSites: bool
    })
  };

  static defaultProps = {
    options: {
      apodType: "today",
      apodFavorites: {},
      hiResOnly: false,
      showTopSites: false
    }
  };

  state = this.props.options;

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
    const { apodType, apodFavorites, hiResOnly, showTopSites } = this.state;

    return (
      <Apod
        selection={apodType}
        favorites={apodFavorites}
        isHighRes={hiResOnly}
        showTopSites={showTopSites}
      />
    );
  }
}

// Fetch chrome storage settings from options and load
chrome.storage.sync.get(
  ["apodType", "hiResOnly", "apodFavorites", "showTopSites", "todayCount"],
  options => {
    ga({
      type: "pageview",
      category: `v${manifest.version}`,
      page: "apod-by-trav"
    });
    ReactDOM.render(<App options={options} />, document.getElementById("root"));
  }
);

serviceWorker.register();
