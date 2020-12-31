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
  showHistoryRow: true,
  isTodayLimitOn: false,
  todayLimit: 5,
};
const optionsForm = {
  chooseApod: optionsEl["choose-apod"],
  highResOnly: optionsEl["high-res-only"],
  showTopSites: optionsEl["show-top-sites"],
  showHistoryRow: optionsEl["show-history-row"],
  isTodayLimitOn: optionsEl["show-today-limit"],
  todayCountInput: optionsEl["today-count-input"],
};

const syncGetOptions = [
  "apodType",
  "hiResOnly",
  "showTopSites",
  "showHistoryRow",
  "isTodayLimitOn",
  "todayLimit",
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

  saveTodayCountInput() {
    const todayLimit = parseInt(optionsForm.todayCountInput.value);
    saveOption({ todayLimit });
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
    this.createListener(
      optionsForm.chooseApod[0],
      saveOption({ apodType: optionsForm.chooseApod.value })
    );
    this.createListener(
      optionsForm.chooseApod[1],
      saveOption({ apodType: optionsForm.chooseApod.value })
    );
    this.createListener(
      optionsForm.highResOnly,
      saveOption({ hiResOnly: optionsForm.highResOnly.checked })
    );
    this.createListener(
      optionsForm.showTopSites,
      saveOption({ showTopSites: optionsForm.showTopSites.checked })
    );
    this.createListener(
      optionsForm.showHistoryRow,
      saveOption({ showHistoryRow: optionsForm.showHistoryRow.checked })
    );
    this.createListener(optionsForm.todayCountInput, this.saveTodayCountInput);
    this.createListener(optionsForm.isTodayLimitOn, this.saveIsTodayLimitOn);
  }

  setDefaultValues() {
    storageSync(
      ({
        apodType,
        hiResOnly,
        showTopSites,
        showHistoryRow,
        isTodayLimitOn,
        todayLimit,
      }) => {
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
        if (showHistoryRow === undefined) {
          options.showHistoryRow = defaultOptions.showHistoryRow;
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
      ({
        apodType,
        hiResOnly,
        showTopSites,
        showHistoryRow,
        isTodayLimitOn,
        todayLimit,
      }) => {
        optionsEl[apodType].checked = true;
        optionsForm.highResOnly.checked = hiResOnly;
        optionsForm.showTopSites.checked = showTopSites;
        optionsForm.showHistoryRow.checked = showHistoryRow;
        optionsForm.isTodayLimitOn.checked = isTodayLimitOn;
        optionsForm.todayCountInput.value = todayLimit;
        optionsForm.todayCountInput.disabled = !isTodayLimitOn;
      }
    );
  }
}

new ApodOptions();
