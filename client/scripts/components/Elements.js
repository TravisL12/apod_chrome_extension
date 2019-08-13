import { $, clearElement } from "scripts/utilities";
import { TitleLoader } from "scripts/LoadingSpinner";

const ApodElements = {
  // Initialize image & video elements
  image: $("#apod-image"),
  bgImage: $("#apod-image-vertical-bg"),
  video: $("#apod-image"),
  videoIFrame: $("#apod-image iframe"),
  explanation: $(".apod__header .explanation"),

  // Initialize various elements
  title: $("#apod-title"),
  date: $("#apod-date"),
  loading: new TitleLoader($("#apod-loading")),
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
    ApodElements.loading.toggle(false);
    ApodElements.clearKnowMore();
  }
};

export default ApodElements;
