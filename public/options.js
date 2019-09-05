const defaultOptions = {
  apodType: "random",
  hiResOnly: false,
  showTopSites: true
};

class ApodOptions {
  constructor() {
    this.form = document.getElementById("apod-options");
    this.restoreOptions();
  }

  save = obj => {
    chrome.storage.sync.set(obj);
    setTimeout(window.close, 350);
  };

  setDefaultValues = ({ apodType, hiResOnly, showTopSites }) => {
    if (!apodType) {
      chrome.storage.sync.set({
        apodType: defaultOptions.apodType
      });
    }
    if (hiResOnly === undefined) {
      chrome.storage.sync.set({
        hiResOnly: defaultOptions.hiResOnly
      });
    }
    if (showTopSites === undefined) {
      chrome.storage.sync.set({
        showTopSites: defaultOptions.showTopSites
      });
    }
  };

  saveApodType = () => {
    this.save({ apodType: this.form["choose-apod"].value });
  };

  saveHiResOnly = () => {
    this.save({ hiResOnly: this.form["high-res-only"].checked });
  };

  saveTopSitesToggle = () => {
    this.save({ showTopSites: this.form["show-top-sites"].checked });
  };

  restoreOptions() {
    chrome.storage.sync.get(
      ["apodType", "hiResOnly", "showTopSites"],
      items => {
        const { apodType, hiResOnly, showTopSites } = items;
        this.setDefaultValues(items);

        this.form[apodType].checked = true;
        this.form["high-res-only"].checked = hiResOnly;
        this.form["show-top-sites"].checked = showTopSites;

        this.form["choose-apod"][0].addEventListener(
          "change",
          this.saveApodType
        );

        this.form["choose-apod"][1].addEventListener(
          "change",
          this.saveApodType
        );

        this.form["high-res-only"].addEventListener(
          "change",
          this.saveHiResOnly
        );

        this.form["show-top-sites"].addEventListener(
          "change",
          this.saveTopSitesToggle
        );
      }
    );
  }
}

new ApodOptions();
