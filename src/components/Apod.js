/*global chrome*/
import React, { Component } from "react";
import reqwest from "reqwest";
import { string, arrayOf, shape } from "prop-types";
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
import History from "../utilities/history";
import Preload from "../utilities/preload-utility";

const MAX_ERROR_TRIES = 3;
const ERROR_MESSAGE = "NASA APOD Error: Please reload or try Again Later";
const DELAY_FOR_HD_LOAD = 3000;
const history = new History();
const preload = new Preload();

class Apod extends Component {
  static propType = {
    selection: string,
    isHighRes: string,
    favorites: arrayOf(
      shape({
        url: string,
        title: string
      })
    )
  };

  state = {
    apodImage: null,
    response: null,
    isLoading: true,
    isImageHD: false,
    hasLoadingError: false
  };

  componentDidMount() {
    const date = this.props.selection === "random" ? randomDate() : undefined;
    this.getImage(date);
  }

  specificDate = date => {
    this.getImage(date);
  };

  previous = () => {
    const { date } = this.state.response;
    if (date !== MIN_APOD_DATE) {
      this.getImage(adjacentDate(date, -1));
    }
  };

  next = () => {
    const { date } = this.state.response;
    if (!isToday(date)) {
      this.getImage(adjacentDate(date, 1));
    }
  };

  current = () => {
    this.getImage(today);
  };

  random = () => {
    if (preload.hasPreloaded && preload.dates.length > 0) {
      const response = preload.getPreloadImage();
      if (response) {
        this.setState({ isLoading: true, response: null });
        this.loadApod(response);
        return;
      }
    }

    this.getImage(randomDate());
  };

  forceHighDef = () => {
    this.setState({ isLoading: true });
    this.preLoadImage(this.state.response, true);
  };

  recallHistory = direction => {
    const response =
      direction === "next" ? history.getNextDate() : history.getPreviousDate();
    if (response) {
      this.setState({ isLoading: true, response: null });
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
    this.setState({ isLoading: true, response: null });
    const data = { date, api_key: API_KEY };
    reqwest({ data, url: APOD_API_URL }).then(this.loadApod, () =>
      this.errorApod(errorCount)
    );
  };

  loadApod = response => {
    const { isHighRes } = this.props;
    history.add(response);
    if (response.media_type === "video") {
      this.setState({
        response,
        apodImage: null,
        isLoading: false
      });
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
    const { favorites } = this.props;
    const {
      response,
      apodImage,
      isImageHD,
      isLoading,
      hasLoadingError
    } = this.state;

    const handlers = {
      TODAY: this.current,
      RANDOM_DAY: this.random,
      PREVIOUS_DAY: this.previous,
      NEXT_DAY: this.next,
      PREVIOUS_HISTORY: () => {
        this.recallHistory("previous");
      },
      NEXT_HISTORY: () => {
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

    return (
      <GlobalHotKeys keyMap={KEY_MAP} handlers={handlers}>
        <div className="apod-container" tabIndex={0}>
          <div className="apod__header">
            <TopSites />
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
          {isLoading && <TitleLoader />}
          <ApodDisplay
            response={response}
            isLoading={isLoading}
            loadedImage={apodImage}
          />
          {!isLoading && (
            <Drawer
              response={response}
              favorites={favorites}
              specificDate={this.specificDate}
              history={history}
            />
          )}
        </div>
      </GlobalHotKeys>
    );
  }
}

export default Apod;
