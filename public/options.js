/*global chrome*/
const SAVED_MESSAGE_DISPLAY_TIME = 1000;
const saveAnnounced = document.getElementById("save-announced");
const optionsEl = document.getElementById("apod-options");
const manifest = chrome.runtime.getManifest();
document.getElementById("version").textContent = `v${manifest.version}`;
const defaultOptions = {
  apodType: "random",
  hiResOnly: false,
  showTopSites: true,
  isTodayLimitOn: false,
  todayLimit: 5
};
const optionsForm = {
  chooseApod: optionsEl["choose-apod"],
  highResOnly: optionsEl["high-res-only"],
  showTopSites: optionsEl["show-top-sites"],
  isTodayLimitOn: optionsEl["show-today-limit"],
  todayCountInput: optionsEl["today-count-input"]
};

const syncGetOptions = [
  "apodType",
  "hiResOnly",
  "showTopSites",
  "isTodayLimitOn",
  "todayLimit"
];

function storageSync(fn) {
  chrome.storage.sync.get(syncGetOptions, fn);
}

function saveOption(obj, cb) {
  displaySaved();
  cb ? chrome.storage.sync.set(obj, cb) : chrome.storage.sync.set(obj);
}

function displaySaved() {
  saveAnnounced.classList.remove("hide");
  setTimeout(() => {
    saveAnnounced.classList.add("hide");
  }, SAVED_MESSAGE_DISPLAY_TIME);
}

class ApodOptions {
  constructor() {
    this.setDefaultValues();
    this.setListeners();
  }

  createListener(el, fn) {
    el.addEventListener("change", fn.bind(this));
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
    if (!isChecked) {
      saveOption({ todayCount: 0 });
    }
    saveOption({ isTodayLimitOn: isChecked });
  }

  setListeners() {
    this.createListener(optionsForm.chooseApod[0], this.saveApodType);
    this.createListener(optionsForm.chooseApod[1], this.saveApodType);
    this.createListener(optionsForm.highResOnly, this.saveHiResOnly);
    this.createListener(optionsForm.showTopSites, this.saveTopSitesToggle);
    this.createListener(optionsForm.todayCountInput, this.saveTodayCountInput);
    this.createListener(optionsForm.isTodayLimitOn, this.saveIsTodayLimitOn);
  }

  setDefaultValues() {
    storageSync(
      ({ apodType, hiResOnly, showTopSites, isTodayLimitOn, todayLimit }) => {
        const options = {};

        if (!apodType) {
          options.apodType = defaultOptions.apodType;
        }
        if (hiResOnly === undefined) {
          options.hiResOnly = defaultOptions.hiResOnly;
        }
        if (showTopSites === undefined) {
          options.showTopSites = defaultOptions.showTopSites;
        }
        if (isTodayLimitOn === undefined) {
          options.isTodayLimitOn = defaultOptions.isTodayLimitOn;
        }
        if (todayLimit === undefined) {
          options.todayLimit = defaultOptions.todayLimit;
        }

        saveOption(options, this.loadOptions.bind(this));
      }
    );
  }

  loadOptions() {
    storageSync(
      ({ apodType, hiResOnly, showTopSites, isTodayLimitOn, todayLimit }) => {
        optionsEl[apodType].checked = true;
        optionsForm.highResOnly.checked = hiResOnly;
        optionsForm.showTopSites.checked = showTopSites;
        optionsForm.isTodayLimitOn.checked = isTodayLimitOn;
        optionsForm.todayCountInput.value = todayLimit;
        optionsForm.todayCountInput.disabled = !isTodayLimitOn;
      }
    );
  }
}

new ApodOptions();
