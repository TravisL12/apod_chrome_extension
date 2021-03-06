/*global chrome*/
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { number, shape, bool, string, objectOf } from "prop-types";

import * as serviceWorker from "./serviceWorker";
import Apod from "./components/Apod";
import "./styles/style.scss";
import { today } from "./utilities/dateUtility";

export default class App extends Component {
  static propTypes = {
    apodType: string,
    apodFavorites: objectOf(
      shape({
        url: string,
        title: string,
      })
    ),
    hiResOnly: bool,
    showTopSites: bool,
    showHistoryRow: bool,
    currentDate: string,
    todayCount: number,
    todayLimit: number,
    isTodayLimitOn: bool,
  };

  static defaultProps = {
    apodType: "random",
    apodFavorites: {},
    hiResOnly: false,
    showTopSites: true,
    showHistoryRow: true,
    todayCount: 0,
    todayLimit: 5,
    isTodayLimitOn: false,
  };

  state = {
    ...this.props,
    isLoading: !this.props.currentDate || this.props.currentDate !== today(),
  };

  componentDidMount() {
    this.updateCurrentDate().then((updateCurrentDateOptions) => {
      if (updateCurrentDateOptions) {
        this.setState({ ...updateCurrentDateOptions, isLoading: false });
      }
    });
    this.setChromeListener();
  }

  setChromeListener() {
    chrome.storage.onChanged.addListener((changes) => {
      const updatedSettings = Object.keys(changes).reduce((result, setting) => {
        result[setting] = changes[setting].newValue;
        return result;
      }, this.state);

      this.setState(updatedSettings);
    });
  }

  // Setup a promise to wait for chrome storage to sync the updated date
  // this feels heavy handed
  updateCurrentDate() {
    return new Promise((resolve) => {
      if (this.state.isLoading) {
        const updateCurrentDateOptions = {
          currentDate: today(),
          todayCount: 0,
        };

        chrome.storage.sync.set(updateCurrentDateOptions, () => {
          resolve(updateCurrentDateOptions);
        });
      } else {
        resolve();
      }
    });
  }

  render() {
    const {
      apodType: selection,
      apodFavorites: favorites,
      hiResOnly: isHighRes,
      showTopSites,
      showHistoryRow,
      currentDate,
      todayCount: count,
      todayLimit: limit,
      isTodayLimitOn: isLimitOn,
      isLoading,
    } = this.state;

    if (isLoading) {
      return null;
    }

    const showTodayOptions = {
      count,
      limit,
      isLimitOn,
    };

    return (
      <Apod
        selection={selection}
        favorites={favorites}
        isHighRes={isHighRes}
        showTopSites={showTopSites}
        showHistoryRow={showHistoryRow}
        currentDate={currentDate}
        showTodayOptions={showTodayOptions}
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
    "showHistoryRow",
    "currentDate",
    "todayCount",
    "todayLimit",
    "isTodayLimitOn",
  ],
  (options) => {
    ReactDOM.render(<App {...options} />, document.getElementById("root"));
  }
);

serviceWorker.register();
