/*global chrome*/
const SAVED_MESSAGE_DISPLAY_TIME = 1000;
const defaultOptions = {
  apodType: "random",
  hiResOnly: false,
  showTopSites: true,
  isTodayLimitOn: false,
  todayLimit: 5
};
const savedAnnounced = document.getElementById("saved-announced");
const optionsEl = document.getElementById("apod-options");
const currentCount = document.getElementById("current-count");
const optionsForm = {
  chooseApod: optionsEl["choose-apod"],
  highResOnly: optionsEl["high-res-only"],
  showTopSites: optionsEl["show-top-sites"],
  isTodayLimitOn: optionsEl["show-today-limit"],
  todayCountInput: optionsEl["today-count-input"]
};

const manifest = chrome.runtime.getManifest();
document.getElementById("version").textContent = `v${manifest.version}`;

function saveOption(obj) {
  chrome.storage.sync.set(obj);
  displaySaved();
}

function displaySaved() {
  savedAnnounced.classList.remove("hide");
  setTimeout(() => {
    savedAnnounced.classList.add("hide");
  }, SAVED_MESSAGE_DISPLAY_TIME);
}

class ApodOptions {
  constructor() {
    this.restoreOptions();
  }

  setDefaultValues({
    apodType,
    hiResOnly,
    showTopSites,
    isTodayLimitOn,
    todayLimit
  }) {
    if (!apodType) {
      saveOption({ apodType: defaultOptions.apodType });
    }
    if (hiResOnly === undefined) {
      saveOption({ hiResOnly: defaultOptions.hiResOnly });
    }
    if (showTopSites === undefined) {
      saveOption({ showTopSites: defaultOptions.showTopSites });
    }
    if (isTodayLimitOn === undefined) {
      saveOption({ isTodayLimitOn: defaultOptions.isTodayLimitOn });
    }
    if (todayLimit === undefined) {
      saveOption({ todayLimit: defaultOptions.todayLimit });
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

  saveTodayCountInput() {
    saveOption({ todayLimit: optionsForm.todayCountInput.value });
  }

  saveIsTodayLimitOn() {
    const isChecked = optionsForm.isTodayLimitOn.checked;
    optionsForm.todayCountInput.disabled = !isChecked;
    saveOption({ isTodayLimitOn: isChecked });
  }

  restoreOptions() {
    chrome.storage.sync.get(
      [
        "apodType",
        "hiResOnly",
        "showTopSites",
        "isTodayLimitOn",
        "todayLimit",
        "todayCount"
      ],
      items => {
        const {
          apodType,
          hiResOnly,
          showTopSites,
          isTodayLimitOn,
          todayLimit,
          todayCount
        } = items;
        this.setDefaultValues(items);
        currentCount.textContent = todayCount;
        optionsEl[apodType].checked = true;
        optionsForm.highResOnly.checked = hiResOnly;
        optionsForm.showTopSites.checked = showTopSites;
        optionsForm.isTodayLimitOn.checked = isTodayLimitOn;
        optionsForm.todayCountInput.value = todayLimit;
        optionsForm.todayCountInput.disabled = !isTodayLimitOn;

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

        optionsForm.todayCountInput.addEventListener(
          "change",
          this.saveTodayCountInput.bind(this)
        );

        optionsForm.isTodayLimitOn.addEventListener(
          "change",
          this.saveIsTodayLimitOn.bind(this)
        );
      }
    );
  }
}

new ApodOptions();
