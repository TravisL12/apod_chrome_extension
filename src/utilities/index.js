import { keys } from "lodash";
import celestialDictionary from "../CelestialDictionary";

export const KEY_MAP = {
  RANDOM_DAY: "r",
  TODAY: "t",
  PREVIOUS_DAY: "j",
  NEXT_DAY: "k",
  EXPLANATION_TAB: "e",
  FAVORITES_TAB: "f",
  HISTORY_TAB: "h",
  CLOSE_DRAWER: "esc",
  PREVIOUS_HISTORY: "ArrowLeft",
  NEXT_HISTORY: "ArrowRight"
};

/* Randomizer */
export function randomizer(max, min) {
  min = min || 0;
  max = max || 1;

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

export function apodSourceLink(date) {
  if (!date) return;
  return `https://apod.nasa.gov/apod/ap${linkDateFormat(date)}.html`;
}

export function getImageDimensions(loadedImage) {
  let showFadedBackground = false;
  let backgroundSize = "auto";

  const { width, height } = loadedImage;
  const { innerWidth, innerHeight } = window;

  const widthGTwindow = width > innerWidth;
  const heightGTwindow = height > innerHeight;
  const aspectRatio = width / height;

  if (widthGTwindow || heightGTwindow) {
    showFadedBackground = true;
    backgroundSize = aspectRatio >= 1.3 ? "cover" : "contain";
  }

  if (width / innerWidth > 0.5 || height / innerHeight > 0.5) {
    showFadedBackground = true;
  }

  return { showFadedBackground, backgroundSize };
}

export function findCelestialObjects(explanation) {
  const celestialObjects = keys(celestialDictionary).reduce(
    (result, category) => {
      const match = celestialDictionary[category].filter(constellation => {
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
