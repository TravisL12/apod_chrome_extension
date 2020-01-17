/*global chrome*/

const defaultOptions = {
  apodType: "random",
  hiResOnly: false,
  showTopSites: true
};

const savedAnnounced = document.getElementById("saved-announced");
const optionsEl = document.getElementById("apod-options");
const optionsForm = {
  chooseApod: optionsEl["choose-apod"],
  highResOnly: optionsEl["high-res-only"],
  showTopSites: optionsEl["show-top-sites"]
};

function saveOption(obj) {
  chrome.storage.sync.set(obj);
  displaySaved();
}

function displaySaved() {
  savedAnnounced.classList.remove("hide");
  setTimeout(() => {
    savedAnnounced.classList.add("hide");
  }, 1000);
}

class ApodOptions {
  constructor() {
    this.restoreOptions();
  }

  setDefaultValues({ apodType, hiResOnly, showTopSites }) {
    if (!apodType) {
      saveOption({ apodType: defaultOptions.apodType });
    }
    if (hiResOnly === undefined) {
      saveOption({ hiResOnly: defaultOptions.hiResOnly });
    }
    if (showTopSites === undefined) {
      saveOption({ showTopSites: defaultOptions.showTopSites });
    }
  }

  saveApodType() {
    saveOption({ apodType: optionsForm.chooseApod.value });
  }

  saveHiResOnly() {
    saveOption({ hiResOnly: optionsForm.highResOnly.checked });
  }

  saveTopSitesToggle() {
    saveOption({ showTopSites: optionsForm.showTopSites.checked });
  }

  restoreOptions() {
    chrome.storage.sync.get(
      ["apodType", "hiResOnly", "showTopSites"],
      items => {
        const { apodType, hiResOnly, showTopSites } = items;
        this.setDefaultValues(items);

        optionsEl[apodType].checked = true;
        optionsForm.highResOnly.checked = hiResOnly;
        optionsForm.showTopSites.checked = showTopSites;

        optionsForm.chooseApod[0].addEventListener(
          "change",
          this.saveApodType.bind(this)
        );

        optionsForm.chooseApod[1].addEventListener(
          "change",
          this.saveApodType.bind(this)
        );

        optionsForm.highResOnly.addEventListener(
          "change",
          this.saveHiResOnly.bind(this)
        );

        optionsForm.showTopSites.addEventListener(
          "change",
          this.saveTopSitesToggle.bind(this)
        );
      }
    );
  }
}

new ApodOptions();
