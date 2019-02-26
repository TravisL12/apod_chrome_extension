import { $, clearElement } from "../utilities";
import NavigationButton from "../NavigationButton";

const TitleBar = {
  // Initialize various elements
  title: $("#apod-title"),
  date: $("#apod-date"),
  loading: $("#apod-loading"),
  error: $("#apod-error"),
  imgQualityEl: $("#img-quality"),
  hiResEl: $(".nav-buttons #show-hi-res"),

  // Initialize button objects
  navigation: {
    random: new NavigationButton("#apod-random", 82, "random"),
    previous: new NavigationButton("#apod-previous", 74, "previous"),
    current: new NavigationButton("#apod-current", 84, "current"),
    next: new NavigationButton("#apod-next", 75, "next")
  },

  clearKnowMore: () => {
    const knowMore = $("#know-more-tabs");
    clearElement(knowMore);
  }
};

export default TitleBar;
