/*global chrome*/
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { number, shape, bool, string, objectOf } from "prop-types";

import * as serviceWorker from "./serviceWorker";
import Apod from "./components/Apod";
import ga from "./utilities/ga";
import "./styles/style.scss";
import { manifest } from "./utilities";
import { today } from "./utilities/dateUtility";

export default class App extends Component {
  static propTypes = {
    apodType: string,
    apodFavorites: objectOf(
      shape({
        url: string,
        title: string
      })
    ),
    hiResOnly: bool,
    showTopSites: bool,
    currentDate: string,
    todayCount: number,
    todayLimit: number,
    isTodayLimitOn: bool
  };

  static defaultProps = {
    apodType: "today",
    apodFavorites: {},
    hiResOnly: false,
    showTopSites: false,
    currentDate: today(),
    todayCount: 0,
    todayLimit: 0,
    isTodayLimitOn: false
  };

  state = this.props;

  componentDidMount() {
    if (this.props.currentDate !== today()) {
      const updateCurrentDateOptions = { currentDate: today(), todayCount: 0 };
      chrome.storage.sync.set(updateCurrentDateOptions);
      this.setState(updateCurrentDateOptions);
    }

    chrome.storage.onChanged.addListener(changes => {
      const updatedSettings = Object.keys(changes).reduce((result, setting) => {
        result[setting] = changes[setting].newValue;
        return result;
      }, this.state);

      this.setState(updatedSettings);
    });
  }

  render() {
    const {
      apodType,
      apodFavorites,
      hiResOnly,
      showTopSites,
      currentDate,
      todayCount,
      todayLimit,
      isTodayLimitOn
    } = this.state;

    return (
      <Apod
        selection={apodType}
        favorites={apodFavorites}
        isHighRes={hiResOnly}
        showTopSites={showTopSites}
        currentDate={currentDate}
        todayCount={todayCount}
        todayLimit={todayLimit}
        isTodayLimitOn={isTodayLimitOn}
      />
    );
  }
}

// Fetch chrome storage settings from options and load
chrome.storage.sync.get(
  [
    "apodType",
    "hiResOnly",
    "apodFavorites",
    "showTopSites",
    "currentDate",
    "todayCount",
    "todayLimit",
    "isTodayLimitOn"
  ],
  options => {
    ga({
      type: "pageview",
      category: `v${manifest.version}`,
      page: "apod-by-trav"
    });
    ReactDOM.render(<App {...options} />, document.getElementById("root"));
  }
);

serviceWorker.register();
