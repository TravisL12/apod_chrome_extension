import reqwest from "reqwest";

import { API_KEY, APOD_API_URL } from ".";

const PRELOAD_VALUE = 30;
const RELOAD_THRESHOLD = 5;

export default class Preload {
  constructor() {
    this.loadingCount = 0;
    this.currentIdx = 0;
    this.dates = [];
    this.responses = {};
    this.getImages();
  }

  increaseLoadCount = () => {
    this.loadingCount += 1;
  };

  decreaseLoadCount = () => {
    if (this.loadingCount > 0) {
      this.loadingCount -= 1;
    }
  };

  getImages = (count = PRELOAD_VALUE) => {
    const data = { count, api_key: API_KEY };

    reqwest({ data, url: APOD_API_URL }).then(responses => {
      responses.forEach(response => {
        this.increaseLoadCount();
        !this.dates.includes(response.date)
          ? this.load(response)
          : this.decreaseLoadCount();
      });
    });
  };

  load = response => {
    if (response.media_type === "video") {
      this.addImage(response);
      return;
    }

    const loadedImage = new Image();
    const { hdurl } = response;
    loadedImage.src = hdurl;

    loadedImage.onload = () => {
      const { width, height } = loadedImage;
      width >= 1200 || height >= 900
        ? this.addImage(response)
        : this.decreaseLoadCount();
    };

    loadedImage.onerror = this.decreaseLoadCount;
  };

  addImage = response => {
    this.dates.push(response.date);
    this.responses[response.date] = response;
    this.decreaseLoadCount();
  };

  getPreloadImage = () => {
    const dateKey = this.dates[this.currentIdx];
    this.currentIdx += 1;

    if (
      this.dates.length - this.currentIdx <= RELOAD_THRESHOLD &&
      this.loadingCount === 0
    ) {
      this.getImages();
    }

    return this.responses[dateKey];
  };
}
