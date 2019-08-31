import reqwest from "reqwest";

import { randomDate } from "./dateUtility";
import { API_KEY, APOD_API_URL } from ".";

const PRELOAD_VALUE = 5;

export default class Preload {
  constructor() {
    this.dates = [];
    this.responses = {};
    this.currentIdx = 0;
    this.hasPreloaded = false;
    this.init();
  }

  init = () => {
    for (let i = 0; i < PRELOAD_VALUE; i++) {
      const date = randomDate();
      this.dates.push(date);
      this.getImage(date);
    }
  };

  getImage = date => {
    const data = { date, api_key: API_KEY };
    reqwest({ data, url: APOD_API_URL }).then(this.load);
  };

  load = response => {
    if (response.media_type === "video") {
      this.responses[response.date] = response;
    } else {
      let loadedImage = new Image();
      const { hdurl, url } = response;

      // If the urls are identical just mark it HD
      let isImageHD = /(jpg|jpeg|png|gif)$/i.test(hdurl) || hdurl === url;
      loadedImage.src = isImageHD ? hdurl : url;

      loadedImage.onload = () => {
        this.responses[response.date] = response;
        this.hasPreloaded = true;
      };

      loadedImage.onerror = () => {
        console.log("Preload image didn't work");
      };
    }
  };

  getPreloadImage = () => {
    const dateKey = this.dates[this.currentIdx];
    this.currentIdx += 1;

    if (this.dates.length - this.currentIdx <= 3) {
      this.init();
    }

    return this.responses[dateKey];
  };
}
