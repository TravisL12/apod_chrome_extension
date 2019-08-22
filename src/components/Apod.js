import React, { Component } from "react";
import reqwest from "reqwest";
import { string } from "prop-types";

import Header from "./Header";
import ApodImage from "./ApodImage";
import Drawer from "./Drawer";

class Apod extends Component {
  static propType = {
    selection: string,
    resolution: string
  };

  state = {
    errorCount: 0,
    delayForHdLoad: 3000,
    hiResOnly: this.props.resolution,
    isImageHD: true,
    addToHistory: true,
    randomData: [],
    randomIdx: 0
  };

  componentDidMount() {
    this.getImage().then(resp => {
      console.log(resp);
    });
  }

  getImage = () => {
    return reqwest({
      data: {
        api_key: "hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447"
      },
      url: "https://api.nasa.gov/planetary/apod"
    });
  };

  render() {
    return (
      <>
        <Header />
        <ApodImage />
        <Drawer />
      </>
    );
  }
}

export default Apod;
