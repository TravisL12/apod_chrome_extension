import reqwest from "reqwest";
import ga from "scripts/utilities/ga";
import DateManager from "scripts/DateManager";
import KnowMoreComponent from "scripts/components/KnowMore";
import History from "scripts/components/History";
import NavigationButton from "scripts/NavigationButton";
import ApodElements from "scripts/components/Elements";
import Drawer from "scripts/components/Drawer";

const ERROR_MESSAGE = "NASA APOD Error: Please reload or try Again Later";

class Apod {
  constructor() {
    this.errorCount = 0;
    this.errorLimit = 3;
    this.delayForHdLoad = 3000;
    this.history = new History();
    this.drawer = new Drawer("#apod-drawer");
    this.hiResOnly = false;
    this.isImageHD = true;
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

    // Initialize button objects
    this.navigation = {
      random: new NavigationButton(".nav-buttons .random", 82, "random", this),
      previous: new NavigationButton(
        ".nav-buttons .previous",
        74,
        "previous",
        this
      ),
      current: new NavigationButton(
        ".nav-buttons .current",
        84,
        "current",
        this
      ),
      next: new NavigationButton(".nav-buttons .next", 75, "next", this)
    };
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
    this.getApod(DateManager.today);
  }

  addFadedBackground() {
    ApodElements.bgImage.style["background-image"] = `url(${
      this.loadedImage.src
    })`;
    ApodElements.bgImage.classList.remove("hide");
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
    ApodElements.resetElements();
    this.drawer.resetTabs();
  }

  get isRequestValid() {
    if (this.isRequestInProgress) {
      return false;
    }

    this.isRequestInProgress = true;
    return this.isRequestInProgress;
  }

  getApod(date) {
    if (!this.isRequestValid) {
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
    this.populateTabs(response);

    const isMediaImage = response.media_type === "image";
    ApodElements.image.classList.toggle("hide", !isMediaImage);
    ApodElements.video.classList.toggle("hide", isMediaImage);

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
      ApodElements.error.textContent = ERROR_MESSAGE;
    }
  }

  populateTabs(response) {
    Object.assign(this.drawer.tabs[0], {
      urls: {
        hdurl: response.hdurl,
        url: response.url
      },
      explanation: response.explanation,
      date: response.date
    });

    Object.assign(this.drawer.tabs[1], {
      date: response.date,
      title: response.title,
      url: response.url,
      specificDate: this.specificDate.bind(this)
    });
    this.drawer.tabs[1].checkFavorite();
  }

  wouldYouLikeToKnowMore(text) {
    const knowMore = new KnowMoreComponent(text, this.drawer);
    const { results } = knowMore;

    if (results.length) {
      // Don't draw duplicate tabs beyond the default tabs (i.e. Explanation and Favorite tabs)
      if (this.drawer.tabs.length > 2) {
        return;
      }
      for (let i in results) {
        this.drawer.tabs[0].highlightKeywords(results[i].title, i);
        knowMore.createTab(results[i], i);
      }
    }
  }

  preLoadImage(forceHighDef = false) {
    const Img = new Image();
    const { hdurl, url } = this.response;

    if (!/(jpg|jpeg|png|gif)$/i.test(hdurl)) {
      Img.src = url;
      this.isImageHD = false;
    } else {
      Img.src = hdurl;
      this.isImageHD = true;
    }

    // If the urls are identical just mark it HD
    if (hdurl === url) {
      Img.src = hdurl;
      this.isImageHD = true;
    }

    const timeout = setTimeout(() => {
      if (!Img.complete && !forceHighDef) {
        Img.src = url;
        this.isImageHD = false;
      }
    }, this.delayForHdLoad);

    Img.onload = () => {
      clearTimeout(timeout);
      this.loadedImage = Img;
      this.apodImage();
    };

    Img.onerror = () => {
      console.log("Error: image load");
      clearTimeout(timeout);
      this.isRequestInProgress = false;
      this.random();
    };
  }

  apodImage() {
    ApodElements.image.classList = "apod__image";
    ApodElements.imgQuality.classList.remove("spin-loader");

    ApodElements.image.style["background-image"] = `url(${
      this.loadedImage.src
    })`;
    ApodElements.image.classList.add(`bg-${this.backgroundSize()}`);

    ApodElements.imgQuality.textContent = this.isImageHD ? "HD" : "SD";

    if (!this.isImageHD) {
      const forceLoadHighDefImg = e => {
        this.isRequestInProgress = true;
        ApodElements.showHiRes.classList.add("hide");
        ApodElements.showHiRes.removeEventListener(
          "click",
          forceLoadHighDefImg
        );
        ApodElements.imgQuality.textContent = "";
        ApodElements.imgQuality.classList.add("spin-loader");
        this.preLoadImage(true);
      };
      ApodElements.showHiRes.classList.remove("hide");
      ApodElements.showHiRes.addEventListener("click", forceLoadHighDefImg);
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
    ApodElements.videoIFrame.src = url.href;
    this.constructApod();
  }

  constructApod() {
    const { date, title, explanation } = this.response;

    this.isRequestInProgress = false;
    document.title = title;
    ApodElements.title.textContent = title;
    ApodElements.date.textContent = DateManager.prettyDateFormat(date);
    this.wouldYouLikeToKnowMore(`${title} ${explanation}`);

    if (!DateManager.isInPast(date)) {
      this.isRequestInProgress = false;
      this.current();
    } else {
      const isToday = DateManager.isToday(date);
      this.navigation.current.el.classList.toggle("current", isToday);
      this.navigation.next.el.classList.toggle("hide", isToday);
    }

    ApodElements.loading.classList.add("hide");
    ApodElements.explanation.classList.remove("hide");
  }
}

export default Apod;
