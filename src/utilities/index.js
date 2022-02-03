/*global chrome*/
import download from "downloadjs";
import { keys } from "lodash";
import celestialDictionary from "../CelestialDictionary";

// const APOD_URL = "https://apodapi.herokuapp.com";
export const APOD_API_URL = "https://api.nasa.gov/planetary/apod";
export const API_KEY = "hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447";

// export const APOD_API_URL = `${APOD_URL}/api/`;
export const APOD_SEARCH_URL = `${APOD_API_URL}/search/`;
export const manifest = chrome.runtime.getManifest();
export const KEY_MAP = {
  RANDOM_DAY: "r",
  TODAY: "t",
  PREVIOUS_DAY: "j",
  NEXT_DAY: "k",
  EXPLANATION_TAB: "e",
  FAVORITES_TAB: "f",
  SEARCH_TAB: "s",
  CLOSE_DRAWER: "esc",
  PREVIOUS_HISTORY: "ArrowLeft",
  NEXT_HISTORY: "ArrowRight",
};

export function downloadImage(url) {
  download(url);
}

/* Randomizer */
export function randomizer(max = 1, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
}

// Zero pad dates
export function zeroPad(num) {
  num = `0${num.toString()}`;
  return num.slice(-2);
}

function linkDateFormat(date) {
  const dateStr = date.split("-");
  return `${dateStr[0].slice(-2)}${zeroPad(dateStr[1])}${zeroPad(dateStr[2])}`;
}

// https://apod.nasa.gov/apod/calendar/S_011007.jpg
export function thumbSourceLink(date) {
  if (!date) return;

  return `https://apod.nasa.gov/apod/calendar/S_${linkDateFormat(date)}.jpg`;
}

export function getImageDimensions(loadedImage) {
  let showFadedBackground = false;
  let backgroundSize = "auto";

  const { width, height } = loadedImage;
  const { innerWidth, innerHeight } = window;
  const aspectRatio = width / height;

  const widthGtWindow = width > innerWidth;
  const heightGtWindow = height > innerHeight;

  const widthRatioMax = width / innerWidth > 0.5;
  const heightRatioMax = height / innerHeight > 0.5;

  if (widthGtWindow || heightGtWindow) {
    showFadedBackground = true;
    backgroundSize = aspectRatio >= 1.3 ? "cover" : "contain";
  } else if (widthRatioMax || heightRatioMax) {
    showFadedBackground = true;
  }

  return { showFadedBackground, backgroundSize };
}

export function findCelestialObjects(explanation) {
  const celestialObjects = keys(celestialDictionary).reduce(
    (result, category) => {
      const match = celestialDictionary[category].filter((constellation) => {
        const re = new RegExp(`\\b${constellation}\\b`, "gi");
        return explanation.match(re);
      });

      return result.concat(match);
    },
    []
  );

  const ngcObjects = explanation.match(/NGC(-|\s)?\d{1,7}/gi) || [];

  const results = new Set(celestialObjects.concat(ngcObjects)); // get unique values
  return [...results];
}
