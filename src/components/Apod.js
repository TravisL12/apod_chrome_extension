/*global chrome*/
import React, { Component } from "react";
import axios from "axios";
import { bool, string, arrayOf, shape } from "prop-types";
import { GlobalHotKeys } from "react-hotkeys";

import ApodDisplay from "./ApodDisplay";
import Drawer from "./Drawer";
import Title from "./Title";
import TopSites from "./TopSites";
import { TitleLoader } from "./LoadingSpinner";
import { thumbSourceLink, KEY_MAP, APOD_API_URL, API_KEY } from "../utilities";
import {
  adjacentDate,
  isToday,
  today,
  randomDate,
  MIN_APOD_DATE
} from "../utilities/dateUtility";
import HistoryHelper from "../utilities/history";
import Preload from "../utilities/preload-utility";
import ga from "../utilities/ga";

const MAX_ERROR_TRIES = 3;
const ERROR_MESSAGE = "NASA APOD Error: Please reload or try Again Later";
const DELAY_FOR_HD_LOAD = 3000;
const historyHelper = new HistoryHelper();
const preload = new Preload();

class Apod extends Component {
  static propType = {
    selection: string,
    isHighRes: string,
    showTopSites: bool,
    favorites: arrayOf(
      shape({
        url: string,
        title: string
      })
    )
  };

  state = {
    apodImage: undefined,
    response: undefined,
    isLoading: true,
    isImageHD: false,
    hasLoadingError: false,
    videoUrl: undefined
  };

  componentDidMount() {
    const bypassLoadCount = true;
    this.props.selection === "random"
      ? this.random(bypassLoadCount)
      : this.current();
  }

  specificDate = date => {
    this.getImage(date);
  };

  previousNext = (isValid, direction = 1) => {
    if (!this.state.response) return;

    const { date } = this.state.response;
    if (isValid) {
      this.getImage(adjacentDate(date, direction));
    }
  };

  previous = () => {
    previousNext(date !== MIN_APOD_DATE, -1);
  };

  next = () => {
    previousNext(!isToday(date));
  };

  current = () => {
    this.getImage(today());
  };

  setLoading = () => {
    this.setState({ isLoading: true, response: undefined });
  };

  random = (bypassLoadCount = false) => {
    if (preload.dates.length > 0) {
      const response = preload.getPreloadImage(bypassLoadCount);

      if (response) {
        this.setLoading();
        this.loadApod(response);
        return;
      }
    }

    this.getImage(randomDate());
  };

  forceHighDef = () => {
    this.preLoadImage(this.state.response, true);
  };

  recallHistory = direction => {
    const response =
      direction === "next"
        ? historyHelper.getNextDate()
        : historyHelper.getPreviousDate();
    if (response) {
      this.setLoading();
      this.loadApod(response);
    }
  };

  saveFavorite = () => {
    const { favorites } = this.props;
    const { date, title } = this.state.response;

    if (!favorites || !favorites[date]) {
      chrome.storage.sync.set({
        apodFavorites: {
          ...favorites,
          [date]: {
            title,
            imgUrl: thumbSourceLink(date)
          }
        }
      });
    }
  };

  getImage = (date, errorCount = 0) => {
    this.setLoading();
    const params = { date, api_key: API_KEY };
    axios.get(APOD_API_URL, { params }).then(
      ({ data }) => this.loadApod(data),
      () => this.errorApod(errorCount)
    );
  };

  loadApod = response => {
    const { isHighRes } = this.props;
    historyHelper.add(response);
    if (response.media_type === "video") {
      try {
        const videoUrl = new URL(response.url);
        this.setState({
          response,
          videoUrl,
          apodImage: undefined,
          isLoading: false
        });
      } catch (err) {
        console.log(err);
        this.random();
      }
    } else {
      this.preLoadImage(response, isHighRes);
    }
  };

  errorApod = errorCount => {
    if (errorCount >= MAX_ERROR_TRIES) {
      this.setState({ hasLoadingError: true });
    } else {
      errorCount++;
      console.log(errorCount, "error count!!!");
      this.getImage(randomDate(), errorCount);
    }
  };

  preLoadImage = (response, forceHighDef = false) => {
    let loadedImage = new Image();
    const { hdurl, url } = response;

    // If the urls are identical just mark it HD
    let isImageHD = /(jpg|jpeg|png|gif)$/i.test(hdurl) || hdurl === url;
    loadedImage.src = isImageHD ? hdurl : url;

    const timeout = setTimeout(() => {
      if (!loadedImage.complete && !forceHighDef) {
        loadedImage.src = url;
        isImageHD = false;
      }
    }, DELAY_FOR_HD_LOAD);

    loadedImage.onload = () => {
      clearTimeout(timeout);
      ga({ category: "APOD", action: "viewed", label: response.date });
      this.setState({
        response,
        isImageHD,
        isLoading: false,
        apodImage: loadedImage
      });
    };

    loadedImage.onerror = () => {
      clearTimeout(timeout);
    };
  };

  render() {
    const { favorites, showTopSites } = this.props;
    const {
      response,
      apodImage,
      isImageHD,
      isLoading,
      hasLoadingError,
      videoUrl
    } = this.state;

    const handlers = {
      TODAY: () => {
        ga({ category: "Button", action: "clicked", label: "current" });
        this.current();
      },
      RANDOM_DAY: () => {
        ga({ category: "Button", action: "clicked", label: "random" });
        this.random();
      },
      PREVIOUS_DAY: () => {
        ga({ category: "Button", action: "clicked", label: "previous" });
        this.previous();
      },
      NEXT_DAY: () => {
        ga({ category: "Button", action: "clicked", label: "next" });
        this.next();
      },
      PREVIOUS_HISTORY: () => {
        ga({ category: "Button", action: "clicked", label: "historyPrevious" });
        this.recallHistory("previous");
      },
      NEXT_HISTORY: () => {
        ga({ category: "Button", action: "clicked", label: "historyNext" });
        this.recallHistory("next");
      }
    };

    const dateNavigation = {
      previous: this.previous,
      next: this.next,
      current: this.current,
      random: this.random,
      forceHighDef: this.forceHighDef,
      saveFavorite: this.saveFavorite
    };

    const headerStyle = {
      justifyContent: showTopSites ? "space-between" : "flex-end"
    };

    return (
      <GlobalHotKeys keyMap={KEY_MAP} handlers={handlers}>
        <div className="apod-container" tabIndex={0}>
          <div className="apod__header" style={headerStyle}>
            {showTopSites && <TopSites />}
            {!isLoading && (
              <Title
                response={response}
                isImageHD={isImageHD}
                isFavorite={!!favorites[response.date]}
                dateNavigation={dateNavigation}
                specificDate={this.specificDate}
              />
            )}
          </div>
          {hasLoadingError && <div class="apod__error">{ERROR_MESSAGE}</div>}
          <TitleLoader isLoading={isLoading} />
          <ApodDisplay
            videoUrl={videoUrl}
            isLoading={isLoading}
            loadedImage={apodImage}
          />
          <Drawer
            response={response}
            favorites={favorites}
            specificDate={this.specificDate}
            historyHelper={historyHelper}
          />
        </div>
      </GlobalHotKeys>
    );
  }
}

export default Apod;
