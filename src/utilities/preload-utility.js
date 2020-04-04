/*global chrome*/
import axios from "axios";
import { APOD_API_URL, randomizer } from "./index";
import { subtractDates, today } from "./dateUtility";

const CURRENT_DATE_RANGE = 10;
const PRELOAD_VALUE = 15;
const RELOAD_THRESHOLD = 5;

export default class Preload {
  constructor() {
    this.randomRequestPending = false;
    this.loadingCount = 0;
    this.dates = [];

    chrome.storage.sync.get(["preloadResponse"], ({ preloadResponse }) => {
      if (preloadResponse) {
        this.dates.push(preloadResponse);
      }
      this.getDateRangeImages();
      this.getImages();
    });
  }

  decreaseLoadCount = () => {
    if (this.loadingCount > 0) {
      this.loadingCount -= 1;
    }
  };

  // Preload APODs from today to {CURRENT_DATE_RANGE } days ago
  // This doesn't need to be in the this.dates array since these dates
  // don't need to be specifically navigated to.
  getDateRangeImages = (end_date = today()) => {
    const start_date = subtractDates(CURRENT_DATE_RANGE, end_date);
    const params = { start_date, end_date };
    axios
      .get(APOD_API_URL, { params })
      .then(({ data }) => {
        data.forEach((response) => {
          const { hdurl, url, media_type } = response;
          if (media_type === "image") {
            const loadedImage = new Image();
            loadedImage.src = hdurl || url;
          }
        });
      })
      .catch((err) => err);
  };

  getImages = (count = PRELOAD_VALUE) => {
    if (this.randomRequestPending) return;
    this.randomRequestPending = true;
    const params = { count };
    axios
      .get(APOD_API_URL, { params })
      .then((response) => {
        this.randomRequestPending = false;
        this.processResponse(response);
      })
      .catch((err) => err);
  };

  processResponse = ({ data }) => {
    data.forEach((response) => {
      this.loadingCount += 1;
      !this.dates.find((date) => date === response.date)
        ? this.load(response)
        : this.decreaseLoadCount();
    });
  };

  load = (response) => {
    const { hdurl, url, media_type } = response;

    if (media_type === "video") {
      this.decreaseLoadCount();
      return;
    }

    const loadedImage = new Image();
    loadedImage.src = hdurl || url;

    loadedImage.onload = () => {
      const { width, height } = loadedImage;
      width >= 1200 || height >= 900 // these dimensions are arbitrary
        ? this.addImage(response)
        : this.decreaseLoadCount();
    };

    loadedImage.onerror = this.decreaseLoadCount;
  };

  addImage = (response) => {
    chrome.storage.sync.set({
      preloadResponse: response,
    });
    this.dates.push(response);
    this.decreaseLoadCount();
  };

  getPreloadImage = (bypassLoadCount = false) => {
    const randomIdx = randomizer(this.dates.length - 1);
    const response = this.dates.splice(randomIdx, 1)[0];

    if (
      !bypassLoadCount &&
      this.dates.length <= RELOAD_THRESHOLD &&
      this.loadingCount < 3
    ) {
      this.getImages();
    }

    return response;
  };
}
