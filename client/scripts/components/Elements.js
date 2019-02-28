import { $, clearElement } from "../utilities/";

const Elements = {
  // Initialize image & video elements
  image: $("#apod-image"),
  bgImage: $("#apod-image-vertical-bg"),
  video: $("#apod-video"),
  videoIFrame: $("#apod-video iframe"),
  explanation: $(".apod__header .explanation"),

  // Initialize various elements
  title: $("#apod-title"),
  date: $("#apod-date"),
  loading: $("#apod-loading"),
  error: $("#apod-error"),
  imgQuality: $("#img-quality"),
  showHiRes: $(".nav-buttons #show-hi-res"),

  clearKnowMore: () => {
    const knowMore = $("#know-more-tabs");
    clearElement(knowMore);
  }
};

export default Elements;
