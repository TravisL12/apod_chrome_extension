import reqwest from "reqwest";
import { $, clearElement } from "../utilities";
import ga from "../utils/ga";
import DateManager from "../DateManagement";
import KnowMoreComponent from "./KnowMore";
import { drawer } from "../../index.js";
import History from "./History";
import TitleBar from "./TitleBar";

// Initialize image & video elements
const apodImage = $("#apod-image");
const apodBgImage = $("#apod-image-vertical-bg");
const apodVideo = $("#apod-video");
const apodVideoIFrame = $("#apod-video iframe");

function loadSettings() {
  // Fetch chrome storage settings from options and load
  chrome.storage.sync.get(["apodType", "hiResOnly"], items => {
    if (items.hiResOnly) {
      this.hiResOnly = true;
    }
    ga({ type: "pageview", category: "v2.3.2", page: "apod-by-trav" });
    const apodOptionType = items.apodType || "today";
    apodOptionType == "today" ? this.current() : this.random();
  });
}

class Apod {
  constructor() {
    this.hiResOnly = false;
    this.errorCount = 0;
    this.errorLimit = 3;
    this.isImageHD = true;
    this.delayForHdLoad = 3000;
    this.history = new History();
    this.addToHistory = true;

    document.addEventListener("keyup", e => {
      if (this.addToHistory) {
        let recalledResponse = false;

        if (e.which === 37) {
          // left arrow key
          recalledResponse = this.history.recall(-1);
        } else if (e.which === 39) {
          // right arrow key
          recalledResponse = this.history.recall(1);
        }

        if (recalledResponse) {
          this._setLoadingView();
          this.addToHistory = false;
          this.formatResponse(recalledResponse);
        }
      }
    });
    loadSettings.call(this);
  }

  specificDate(date) {
    this.getApod(date);
  }

  random() {
    this.getApod(DateManager.randomDate());
  }

  previous() {
    this.getApod(DateManager.adjacentDate(this.response.date, -1));
  }

  next() {
    this.getApod(DateManager.adjacentDate(this.response.date, 1));
  }

  current() {
    this.getApod();
  }

  addFadedBackground() {
    apodBgImage.style["background-image"] = `url(${this.loadedImage.src})`;
    apodBgImage.classList.remove("hide");
  }

  backgroundSize() {
    const widthGTwindow = this.loadedImage.width > window.innerWidth;
    const heightGTwindow = this.loadedImage.height > window.innerHeight;
    const aspectRatio = this.loadedImage.width / this.loadedImage.height;

    if (widthGTwindow || heightGTwindow) {
      this.addFadedBackground();
      return aspectRatio >= 1.3 ? "cover" : "contain";
    }

    if (
      this.loadedImage.width / window.innerWidth > 0.5 ||
      this.loadedImage.height / window.innerHeight > 0.5
    ) {
      this.addFadedBackground();
    }

    return "auto";
  }

  _setLoadingView() {
    apodImage.style["background-image"] = "";
    apodImage.style["background-size"] = "";
    apodImage.classList.add("hide");

    apodBgImage.style["background-image"] = "";
    apodVideo.classList.add("hide");
    apodVideoIFrame.src = "";

    $(".apod__header .explanation").classList.add("hide");
    TitleBar.hiResEl.classList.add("hide");
    TitleBar.loading.classList.remove("hide");
    clearElement(TitleBar.knowMore);

    drawer.closeDrawer();
    drawer.clearKnowMoreTabs();
  }

  isRequestValid() {
    if (this.isRequestInProgress) {
      return false;
    }

    this.isRequestInProgress = true;
    return this.isRequestInProgress;
  }

  getApod(date = DateManager.today) {
    if (!this.isRequestValid()) {
      console.log("Request in Progress!");
      return;
    }

    if (!DateManager.isDateValid(date)) {
      this.isRequestInProgress = false;
      return;
    }

    this._setLoadingView();

    reqwest({
      method: "GET",
      url: "https://api.nasa.gov/planetary/apod",
      data: {
        api_key: "hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447",
        date: date
      }
    }).then(this.formatResponse.bind(this), this.errorResponse.bind(this));
  }

  formatResponse(response) {
    ga({ category: "APOD", action: "viewed", label: response.date });
    if (this.addToHistory) {
      this.history.add(response);
    }
    this.addToHistory = true;
    this.response = response;
    this.errorCount = 0;
    this.populateTabs();

    const isMediaImage = response.media_type === "image";
    apodImage.classList.toggle("hide", !isMediaImage);
    apodVideo.classList.toggle("hide", isMediaImage);

    if (isMediaImage) {
      this.preLoadImage(this.hiResOnly);
    } else if (response.media_type === "video") {
      this.apodVideo();
    } else {
      this.random();
    }
  }

  errorResponse(error) {
    this.errorCount++;
    console.log(`Error: APOD API response (${this.errorCount})`);
    this.isRequestInProgress = false;
    if (this.errorCount < this.errorLimit) {
      this.random();
    } else {
      TitleBar.error.textContent =
        "NASA APOD Error: Please reload or try Again Later";
    }
  }

  populateTabs() {
    Object.assign(drawer.tabs[0], {
      urls: {
        hdurl: this.response.hdurl,
        url: this.response.url
      },
      explanation: this.response.explanation,
      date: this.response.date
    });

    Object.assign(drawer.tabs[1], {
      date: this.response.date,
      title: this.response.title,
      url: this.response.url,
      specificDate: this.specificDate.bind(this)
    });
    drawer.tabs[1].checkFavorite();
  }

  wouldYouLikeToKnowMore(text) {
    const knowMore = new KnowMoreComponent(text);
    const results = knowMore.results;

    if (results.length) {
      // Don't draw duplicate tabs beyond the default tabs (i.e. Explanation and Favorite tabs)
      if (drawer.tabs.length > 2) {
        return;
      }
      for (let i in results) {
        drawer.tabs[0].highlightKeywords(results[i].title, i);
        knowMore.createTab(results[i], i);
      }
    }
  }

  preLoadImage(forceHighDef = false) {
    const Img = new Image();

    if (!/(jpg|jpeg|png|gif)$/i.test(this.response.hdurl)) {
      Img.src = this.response.url;
      this.isImageHD = false;
    } else {
      Img.src = this.response.hdurl;
      this.isImageHD = true;
    }

    // If the urls are identical just mark it HD
    if (this.response.hdurl === this.response.url) {
      Img.src = this.response.hdurl;
      this.isImageHD = true;
    }

    const timeout = setTimeout(() => {
      if (!Img.complete && !forceHighDef) {
        Img.src = this.response.url;
        this.isImageHD = false;
      }
    }, this.delayForHdLoad);

    Img.onload = () => {
      clearTimeout(timeout);
      this.loadedImage = Img;
      this.apodImage();
    };

    Img.onerror = () => {
      clearTimeout(timeout);
      console.log("Error: image load");
      this.isRequestInProgress = false;
      this.random();
    };
  }

  apodImage() {
    apodImage.classList = "apod__image";
    TitleBar.imgQualityEl.classList.remove("spin-loader");

    apodImage.style["background-image"] = `url(${this.loadedImage.src})`;
    apodImage.classList.add(`bg-${this.backgroundSize()}`);

    TitleBar.imgQualityEl.textContent = this.isImageHD ? "HD" : "SD";

    if (!this.isImageHD) {
      const forceLoadHighDefImg = e => {
        this.isRequestInProgress = true;
        TitleBar.hiResEl.classList.add("hide");
        TitleBar.hiResEl.removeEventListener("click", forceLoadHighDefImg);
        TitleBar.imgQualityEl.textContent = "";
        TitleBar.imgQualityEl.classList.add("spin-loader");
        this.preLoadImage(true);
      };
      TitleBar.hiResEl.classList.remove("hide");
      TitleBar.hiResEl.addEventListener("click", forceLoadHighDefImg);
    }

    this.constructApod();
  }

  apodVideo() {
    this.response.url = this.response.url.replace(";autoplay=1", "");

    if (!/^http(s?)/i.test(this.response.url)) {
      this.response.url = `https:${this.response.url}`;
    }

    const url = new URL(this.response.url);
    url.search = "autopause=1&autoplay=0";
    apodVideoIFrame.src = url.href;
    this.constructApod();
  }

  constructApod() {
    this.isRequestInProgress = false;
    document.title = this.response.title;
    TitleBar.title.textContent = this.response.title;
    TitleBar.date.textContent = DateManager.prettyDateFormat(
      this.response.date
    );
    this.wouldYouLikeToKnowMore(
      `${this.response.title} ${this.response.explanation}`
    );

    if (!DateManager.isInPast(this.response.date)) {
      this.isRequestInProgress = false;
      this.current();
    } else {
      const isToday = DateManager.isToday(this.response.date);
      TitleBar.navigation.current.el.classList.toggle("current", isToday);
      TitleBar.navigation.next.el.classList.toggle("hide", isToday);
    }

    TitleBar.loading.classList.add("hide");
    $(".apod__header .explanation").classList.remove("hide");
  }
}

export default Apod;
