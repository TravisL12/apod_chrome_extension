/*global chrome*/
import React, { Component } from "react";
import reqwest from "reqwest";
import { string, arrayOf, shape } from "prop-types";

import Title from "./Title";
import ApodImage from "./ApodImage";
import Drawer from "./Drawer";
import { TitleLoader } from "./LoadingSpinner";
import { adjacentDate, today, randomDate } from "../DateManager";
import TopSites from "./TopSites";

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
    const { date, title, url } = this.state.response;

    if (!favorites || !favorites[date]) {
      chrome.storage.sync.set({
        apodFavorites: {
          ...favorites,
          [date]: {
            title,
            imgUrl: url
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
        this.preLoadImage(response, isHighRes);
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

  navigateDates = event => {
    switch (event.which) {
      case 82: // r
        this.random();
        break;
      case 74: // j
        this.previous();
        break;
      case 84: // (t)oday
        this.current();
        break;
      case 75: // k
        this.next();
        break;
      default:
        return;
    }
  };

  render() {
    // TYPE FOR VIDEO????

    const { favorites } = this.props;
    const {
      response,
      apodImage,
      isImageHD,
      isLoading,
      hasLoadingError
    } = this.state;

    const dateNavigation = {
      previous: this.previous,
      next: this.next,
      current: this.current,
      random: this.random,
      forceHighDef: this.forceHighDef,
      saveFavorite: this.saveFavorite
    };

    return (
      <div className="apod-container" tabIndex={0} onKeyUp={this.navigateDates}>
        <div className="apod__header">
          <TopSites />
          {!isLoading && (
            <Title
              response={response}
              isImageHD={isImageHD}
              dateNavigation={dateNavigation}
              specificDate={this.specificDate}
            />
          )}
        </div>
        {hasLoadingError && <div class="apod__error">{ERROR_MESSAGE}</div>}
        {isLoading ? <TitleLoader /> : <ApodImage loadedImage={apodImage} />}
        <Drawer
          response={response}
          favorites={favorites}
          specificDate={this.specificDate}
        />
      </div>
    );
  }
}

export default Apod;
