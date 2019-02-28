import "../styles/options.scss";

class ApodOptions {
  constructor() {
    this.form = document.getElementById("apod-options");
    this.restoreOptions();
  }

  save(obj) {
    chrome.storage.sync.set(obj);
    setTimeout(window.close, 350);
  }

  saveApodType() {
    this.save({ apodType: this.form["choose-apod"].value });
  }

  saveHiResOnly() {
    this.save({ hiResOnly: this.form["high-res-only"].checked });
  }

  restoreOptions() {
    chrome.storage.sync.get(["apodType", "hiResOnly"], items => {
      let type = items.apodType;
      if (!type) {
        type = "today";
        chrome.storage.sync.set({
          apodType: type
        });
      }
      this.form[type].checked = true;
      this.form["high-res-only"].checked = items.hiResOnly;
      this.form["choose-apod"][0].addEventListener(
        "change",
        this.saveApodType.bind(this)
      );
      this.form["choose-apod"][1].addEventListener(
        "change",
        this.saveApodType.bind(this)
      );
      this.form["high-res-only"].addEventListener(
        "change",
        this.saveHiResOnly.bind(this)
      );
    });
  }
}

new ApodOptions();
