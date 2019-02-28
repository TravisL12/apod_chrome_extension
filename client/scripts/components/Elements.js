import { $, clearElement } from "../utilities";
import NavigationButton from "../NavigationButton";

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

  // Initialize button objects
  navigation: {
    random: new NavigationButton(".nav-buttons .random", 82, "random"),
    previous: new NavigationButton(".nav-buttons .previous", 74, "previous"),
    current: new NavigationButton(".nav-buttons .current", 84, "current"),
    next: new NavigationButton(".nav-buttons .next", 75, "next")
  },

  clearKnowMore: () => {
    const knowMore = $("#know-more-tabs");
    clearElement(knowMore);
  }
};

export default Elements;
