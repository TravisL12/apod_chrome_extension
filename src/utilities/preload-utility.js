/*global chrome*/
import axios from "axios";
import { APOD_API_URL, randomizer } from "./index";

const PRELOAD_VALUE = 10;
const RELOAD_THRESHOLD = 3;

export default class Preload {
  constructor() {
    this.randomRequestPending = false;
    this.loadingCount = 0;
    this.dates = [];

    chrome.storage.sync.get(["preloadResponse"], ({ preloadResponse }) => {
      if (preloadResponse) {
        this.dates.push(preloadResponse);
      }
      this.getImages();
    });
  }

  decreaseLoadCount = () => {
    if (this.loadingCount > 0) {
      this.loadingCount -= 1;
    }
  };

  getImages = (count = PRELOAD_VALUE) => {
    if (this.randomRequestPending) return;
    this.randomRequestPending = true;
    const params = {
      count,
      image_thumbnail_size: 450,
      absolute_thumbnail_url: true,
    };
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
      const { width } = loadedImage;
      width >= 800 ? this.addImage(response) : this.decreaseLoadCount();
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
