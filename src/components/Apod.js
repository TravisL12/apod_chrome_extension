import React, { Component } from "react";
import reqwest from "reqwest";
import { string } from "prop-types";

import Header from "./Header";
import ApodImage from "./ApodImage";
import Drawer from "./Drawer";
import { TitleLoader } from "./LoadingSpinner";
import { adjacentDate, today, randomDate } from "../DateManager";

const DELAY_FOR_HD_LOAD = 3000;
const APOD_API_URL = "https://api.nasa.gov/planetary/apod";
const API_KEY = "hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447";

class Apod extends Component {
  static propType = {
    selection: string,
    resolution: string
  };

  state = {
    addToHistory: true,
    apodImage: null,
    response: null,
    isLoading: true,
    isImageHD: false
  };

  componentDidMount() {
    const date = this.props.selection === "random" ? randomDate() : undefined;
    this.getImage(date);
  }

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

  getImage = (date, errorCount = 0) => {
    this.setState({ isLoading: true });
    const data = { date, api_key: API_KEY };

    reqwest({ data, url: APOD_API_URL }).then(
      response => {
        this.preLoadImage(response, this.props.resolution === "HD");
      },
      () => {
        errorCount++;
        console.log(errorCount, "error count!!!");
        this.getImage(randomDate(), errorCount);
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
    if (this.state.isLoading) {
      return <TitleLoader />;
    }

    const dateNavigation = {
      previous: this.previous,
      next: this.next,
      current: this.current,
      random: this.random,
      forceHighDef: this.forceHighDef
    };

    const { response, apodImage, isImageHD } = this.state;

    return (
      <div
        style={{ outline: "none" }}
        tabIndex={0}
        onKeyUp={this.navigateDates}
      >
        <Header
          response={response}
          isImageHD={isImageHD}
          dateNavigation={dateNavigation}
        />
        <ApodImage loadedImage={apodImage} />
        <Drawer response={this.state.response} />
      </div>
    );
  }
}

export default Apod;
