import React, { Component } from "react";
import { string } from "prop-types";

import Header from "./Header";
import TopSites from "./TopSites";
import Title from "./Title";
import ApodImage from "./ApodImage";
import Drawer from "./Drawer";

class Apod extends Component {
  static propType = {
    selection: string
  };

  state = {
    errorCount: 0,
    delayForHdLoad: 3000,
    hiResOnly: false,
    isImageHD: true,
    addToHistory: true,
    randomData: [],
    randomIdx: 0
  };

  render() {
    return (
      <div>
        <Header />
        <TopSites />
        <Title />
        <ApodImage />
        <Drawer />
      </div>
    );
  }
}

export default Apod;
