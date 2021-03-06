/*global chrome*/
import React, { Component } from "react";
import axios from "axios";
import { number, bool, string, objectOf, shape } from "prop-types";
import { GlobalHotKeys } from "react-hotkeys";

import ApodDisplay from "./ApodDisplay";
import Drawer from "./Drawer";
import Title from "./Title";
import TopSites from "./TopSites";
import { TitleLoader } from "./LoadingSpinner";
import { KEY_MAP, APOD_API_URL } from "../utilities";
import {
  adjacentDate,
  isToday,
  today,
  randomDate,
  MIN_APOD_DATE,
} from "../utilities/dateUtility";
import HistoryHelper from "../utilities/history";
import Preload from "../utilities/preload-utility";
import HistoryRow from "./HistoryRow";

const MAX_ERROR_TRIES = 3;
const ERROR_MESSAGE = "NASA APOD Error: Please reload or try Again Later";
const DELAY_FOR_HD_LOAD = 1500;
const historyHelper = new HistoryHelper();
const preload = new Preload();

class Apod extends Component {
  static propTypes = {
    selection: string,
    isHighRes: bool,
    showTopSites: bool,
    showHistoryRow: bool,
    showTodayOptions: shape({
      count: number,
      limit: number,
      isLimitOn: bool,
    }),
    favorites: objectOf(
      shape({
        url: string,
        title: string,
      })
    ),
  };

  state = {
    apodImage: undefined,
    response: undefined,
    isLoading: true,
    isImageHD: false,
    hasLoadingError: false,
    videoUrl: undefined,
  };

  componentDidMount() {
    const bypassLoadCount = true;
    const {
      selection,
      showTodayOptions: { count, limit, isLimitOn },
    } = this.props;

    const chooseRandom =
      selection === "random" || (isLimitOn && count >= limit);

    if (selection === "today" && isLimitOn) {
      chrome.storage.sync.set({ todayCount: count + 1 });
    }

    chooseRandom ? this.random(bypassLoadCount) : this.current();
  }

  setLoading = () => {
    this.setState({ isLoading: true, response: undefined });
  };

  specificDate = (date) => {
    this.getImage(date);
  };

  current = () => {
    this.specificDate(today());
  };

  previous = () => {
    if (!this.state.response) return;

    const { date } = this.state.response;
    if (date !== MIN_APOD_DATE) {
      this.getImage(adjacentDate(date, -1));
    }
  };

  next = () => {
    if (!this.state.response) return;

    const { date } = this.state.response;
    if (!isToday(date)) {
      this.getImage(adjacentDate(date, 1));
    }
  };

  forceHighDef = () => {
    this.preLoadImage(this.state.response, true);
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

  getImage = (date, errorCount = 0) => {
    this.setLoading();
    const params = {
      date,
      image_thumbnail_size: 450,
      absolute_thumbnail_url: true,
    };
    axios.get(APOD_API_URL, { params }).then(
      ({ data }) => this.loadApod(data),
      () => this.errorApod(errorCount)
    );
  };

  recallHistory = (getNext = false) => {
    const response = getNext
      ? historyHelper.getNextDate()
      : historyHelper.getPreviousDate();
    if (response) {
      this.setLoading();
      this.loadApod(response);
    }
  };

  saveFavorite = () => {
    const { favorites } = this.props;
    const { date, title, image_thumbnail } = this.state.response;

    if (!favorites || !favorites[date]) {
      chrome.storage.sync.set({
        apodFavorites: {
          ...favorites,
          [date]: {
            title,
            imgUrl: image_thumbnail,
          },
        },
      });
    }
  };

  loadApod = (response) => {
    const { isHighRes } = this.props;
    historyHelper.add(response);
    if (response.media_type === "video") {
      try {
        const videoUrl = new URL(response.url);
        this.setState({
          response,
          videoUrl,
          apodImage: undefined,
          isLoading: false,
        });
      } catch (err) {
        console.log(err);
        this.random();
      }
    } else {
      this.preLoadImage(response, isHighRes);
    }
  };

  errorApod = (errorCount) => {
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
      this.setState({
        response,
        isImageHD,
        isLoading: false,
        apodImage: loadedImage,
      });
    };

    loadedImage.onerror = () => {
      clearTimeout(timeout);
    };
  };

  render() {
    const { favorites, showTopSites, showHistoryRow } = this.props;
    const {
      response,
      apodImage,
      isImageHD,
      isLoading,
      hasLoadingError,
      videoUrl,
    } = this.state;

    const handlers = {
      TODAY: () => {
        this.current();
      },
      RANDOM_DAY: () => {
        this.random();
      },
      PREVIOUS_DAY: () => {
        this.previous();
      },
      NEXT_DAY: () => {
        this.next();
      },
      PREVIOUS_HISTORY: () => {
        this.recallHistory();
      },
      NEXT_HISTORY: () => {
        this.recallHistory(true);
      },
    };

    const dateNavigation = {
      previous: this.previous,
      next: this.next,
      current: this.current,
      random: this.random,
      forceHighDef: this.forceHighDef,
      saveFavorite: this.saveFavorite,
    };

    const headerStyle = {
      justifyContent: showTopSites ? "space-between" : "flex-end",
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
          <ApodDisplay videoUrl={videoUrl} loadedImage={apodImage} />
          <Drawer
            response={response}
            favorites={favorites}
            specificDate={this.specificDate}
          />
          {showHistoryRow && (
            <HistoryRow
              historyHelper={historyHelper}
              specificDate={this.specificDate}
              activeResponse={response}
            />
          )}
        </div>
      </GlobalHotKeys>
    );
  }
}

export default Apod;
