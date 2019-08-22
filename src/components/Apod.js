import React, { Component } from "react";
import reqwest from "reqwest";
import { string } from "prop-types";

import Header from "./Header";
import ApodImage from "./ApodImage";
import Drawer from "./Drawer";
import DateManager from "../DateManager";

const DELAY_FOR_HD_LOAD = 3000;

class Apod extends Component {
  static propType = {
    selection: string,
    resolution: string
  };

  state = {
    errorCount: 0,
    isImageHD: true,
    addToHistory: true,
    randomData: [],
    randomIdx: 0,
    showBackgroundImage: false,
    apodImage: null,
    response: null
  };

  componentDidMount() {
    this.getImage().then(response => {
      console.log(response);
      this.preLoadImage(response, this.props.resolution === "HD");
    });
  }

  getImage = () => {
    return reqwest({
      data: {
        date: DateManager.randomDate(),
        api_key: "hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447"
      },
      url: "https://api.nasa.gov/planetary/apod"
    });
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
      this.setState({ response, apodImage: loadedImage });
    };

    // loadedImage.onerror = () => {
    //   clearTimeout(timeout);
    //   this.isRequestInProgress = false;
    //   this.random();
    // };
  };

  render() {
    if (!this.state.response) {
      return <h1 style={{ color: "white" }}>Loading</h1>;
    }

    const {
      response: { title, date },
      apodImage
    } = this.state;

    return (
      <>
        <Header title={title} date={date} />
        <ApodImage loadedImage={apodImage} />
        <Drawer />
      </>
    );
  }
}

export default Apod;
