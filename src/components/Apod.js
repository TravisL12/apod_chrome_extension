import React, { Component } from "react";
import reqwest from "reqwest";
import { string } from "prop-types";

import Header from "./Header";
import ApodImage from "./ApodImage";
import Drawer from "./Drawer";
import { SunLoader, MoonLoader, TitleLoader } from "./LoadingSpinner";
import { randomDate } from "../DateManager";

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
    randomData: [],
    randomIdx: 0,
    apodImage: null,
    response: null,
    isLoading: true
  };

  componentDidMount() {
    const date = this.props.selection === "random" ? randomDate() : undefined;
    this.getImage(date);
  }

  getImage = (date, errorCount = 0) => {
    this.setState({ isLoading: true });
    const data = { date, api_key: API_KEY };

    reqwest({ data, url: APOD_API_URL }).then(
      response => {
        console.log(response);
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
      this.setState({ response, isLoading: false, apodImage: loadedImage });
    };

    // loadedImage.onerror = () => {
    //   clearTimeout(timeout);
    //   this.isRequestInProgress = false;
    //   this.random();
    // };
  };

  render() {
    if (this.state.isLoading) {
      return <TitleLoader />;
    }

    const {
      response: { title, date },
      apodImage
    } = this.state;

    return (
      <>
        <Header title={title} date={date} getImage={this.getImage} />
        <ApodImage loadedImage={apodImage} />
        <Drawer />
      </>
    );
  }
}

export default Apod;
