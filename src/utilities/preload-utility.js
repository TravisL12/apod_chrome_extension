/*global chrome*/
import axios from "axios";
import { API_KEY, APOD_API_URL } from ".";
import { today, subtractDates } from "./dateUtility";

const PRELOAD_VALUE = 50;
const RELOAD_THRESHOLD = 5;

class Preload {
  constructor() {
    this.loadingCount = 0;
    this.dates = [];
    this.dateLookup = {};
  }

  initialize = selection => {
    this.selection = selection;

    chrome.storage.sync.get(["preloadResponse"], ({ preloadResponse }) => {
      if (preloadResponse) {
        this.dates.push(preloadResponse);
      }
      this.selection === "random"
        ? this.getRandomImages()
        : this.getDateRangeImages();
    });
  };

  increaseLoadCount = () => {
    this.loadingCount += 1;
  };

  decreaseLoadCount = () => {
    if (this.loadingCount > 0) {
      this.loadingCount -= 1;
    }
  };

  getRandomImages = (count = PRELOAD_VALUE) => {
    const params = { count, api_key: API_KEY };
    this.getImages(params);
  };

  getDateRangeImages = (end_date = today()) => {
    const start_date = subtractDates(50, end_date);
    const params = { start_date, end_date, api_key: API_KEY }; // snake case for request
    this.getImages(params);
  };

  getImages = (params = { api_key: API_KEY }) => {
    axios.get(APOD_API_URL, { params }).then(({ data }) => {
      data.forEach(response => {
        this.increaseLoadCount();
        !this.dates.includes(response.date)
          ? this.load(response)
          : this.decreaseLoadCount();
      });
    });
  };

  load = response => {
    const { hdurl, media_type, date } = response;

    this.dateLookup[date] = response;

    if (media_type === "video") {
      this.decreaseLoadCount();
      return;
    }

    const loadedImage = new Image();
    loadedImage.src = hdurl;

    loadedImage.onload = () => {
      const { width, height } = loadedImage;
      width >= 1200 || height >= 900 // these dimensions are fairly are arbitrary
        ? this.addImage(response)
        : this.decreaseLoadCount();
    };

    loadedImage.onerror = this.decreaseLoadCount;
  };

  addImage = response => {
    chrome.storage.sync.set({
      preloadResponse: response
    });
    this.dates.push(response);
    this.decreaseLoadCount();
  };

  getPreloadImage = (bypassLoadCount = false) => {
    const response = this.dates.shift();

    if (
      !bypassLoadCount &&
      this.dates.length <= RELOAD_THRESHOLD &&
      this.loadingCount < 3
    ) {
      this.getRandomImages();
    }

    return response;
  };
}

export default Preload;
