import { $, clearElement } from "scripts/utilities";

const ApodElements = {
  // Initialize image & video elements
  image: $("#apod-image"),
  bgImage: $("#apod-image-vertical-bg"),
  video: $("#apod-video"),
  videoIFrame: $("#apod-video iframe"),
  explanation: $(".apod__header .explanation"),

  // Initialize various elements
  title: $("#apod-title"),
  date: $("#apod-date"),
  // datePicker: $("#apod-date-picker"),
  loading: $("#apod-loading"),
  error: $("#apod-error"),
  imgQuality: $("#img-quality"),
  showHiRes: $(".nav-buttons #show-hi-res"),

  clearKnowMore: () => {
    clearElement($("#know-more-tabs"));
  },

  resetElements: () => {
    ApodElements.image.style["background-image"] = "";
    ApodElements.image.style["background-size"] = "";
    ApodElements.image.classList.add("hide");

    ApodElements.video.classList.add("hide");
    ApodElements.videoIFrame.src = "";

    ApodElements.bgImage.style["background-image"] = "";

    ApodElements.explanation.classList.add("hide");
    ApodElements.showHiRes.classList.add("hide");
    ApodElements.loading.classList.remove("hide");
    ApodElements.clearKnowMore();
  }
};

export default ApodElements;
