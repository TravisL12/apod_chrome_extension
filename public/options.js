/*global chrome*/
const SAVED_MESSAGE_DISPLAY_TIME = 1000;
const defaultOptions = {
  apodType: "random",
  hiResOnly: false,
  showTopSites: true,
  isTodayLimitOn: false,
  todayLimit: 8
};
const savedAnnounced = document.getElementById("saved-announced");
const optionsEl = document.getElementById("apod-options");
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

function storageSync(fn) {
  chrome.storage.sync.get(
    ["apodType", "hiResOnly", "showTopSites", "isTodayLimitOn", "todayLimit"],
    fn
  );
}

class ApodOptions {
  constructor() {
    this.setDefaultValues();
    this.restoreOptions();
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
    );
  }

  restoreOptions() {
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
