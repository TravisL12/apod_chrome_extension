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
import { thumbSourceLink, KEY_MAP } from "../utilities";
import { adjacentDate, today, randomDate } from "../DateManager";

const MAX_ERROR_TRIES = 3;
const ERROR_MESSAGE = "NASA APOD Error: Please reload or try Again Later";
const DELAY_FOR_HD_LOAD = 3000;
const APOD_API_URL = "https://api.nasa.gov/planetary/apod";
const API_KEY = "hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447";

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
    addToHistory: true,
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
    this.getImage(adjacentDate(this.state.response.date, -1));
  };

  next = () => {
    this.getImage(adjacentDate(this.state.response.date, 1));
  };

  current = () => {
    this.getImage(today);
  };

  random = () => {
    this.getImage(randomDate());
  };

  forceHighDef = () => {
    this.setState({ isLoading: true });
    this.preLoadImage(this.state.response, true);
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
    const { isHighRes } = this.props;
    const data = { date, api_key: API_KEY };

    reqwest({ data, url: APOD_API_URL }).then(
      response => {
        if (response.media_type === "video") {
          this.setState({
            response,
            apodImage: null,
            isLoading: false
          });
        } else {
          this.preLoadImage(response, isHighRes);
        }
      },
      () => {
        if (errorCount >= MAX_ERROR_TRIES) {
          this.setState({ hasLoadingError: true });
        } else {
          errorCount++;
          console.log(errorCount, "error count!!!");
          this.getImage(randomDate(), errorCount);
        }
      }
    );
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
      RANDOM: this.random
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
            />
          )}
        </div>
      </GlobalHotKeys>
    );
  }
}

export default Apod;
