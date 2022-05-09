import { API_KEY, APOD_API_URL, RANDOM_APODS } from '../constants';
import axios from 'axios';
import { TApodResponse, TFetchOptions } from '../pages/types';
import { isDateToday, linkDateFormat } from './dates';
import {
  getLocalChrome,
  saveToHistory,
  setLocalChrome,
} from './chromeOperations';
import { randomizer } from './utilities';

const randomCache = (): Promise<TApodResponse> => {
  return new Promise((resolve) => {
    getLocalChrome([RANDOM_APODS], (options) => {
      const cache = [...(options[RANDOM_APODS] || [])];
      const randomIdx = randomizer(cache.length - 1);
      const item = cache.splice(randomIdx, 1)[0];
      setLocalChrome({ [RANDOM_APODS]: cache });

      if (item) {
        saveToHistory(item);
      }

      resolve(item);
    });
  });
};

const transformResponse = (data: TApodResponse) => {
  data.apodUrl = `https://apod.nasa.gov/apod/ap${linkDateFormat(
    data.date
  )}.html`;
  data.date = data.date.replace('-0', '-');
  data.isToday = isDateToday(data.date);
  return data;
};
export const fetchRandomImage = async (): Promise<TApodResponse> => {
  const params = {
    api_key: API_KEY,
    count: 10,
  };
  try {
    // Look in cache
    const cacheResp = await randomCache();
    if (cacheResp) {
      return cacheResp;
    }

    // Otherwise fetch
    const resp = await axios.get(APOD_API_URL, { params });
    const images = resp.data.map((item: TApodResponse) =>
      transformResponse(item)
    );

    return new Promise((resolve) => {
      setLocalChrome({ [RANDOM_APODS]: images }, async () => {
        const response = await randomCache();
        resolve(response);
      });
    });
  } catch (error) {
    console.error(error);
    // @ts-expect-error
    return { error };
  }
};

export const fetchImage = async (
  options: TFetchOptions = {}
): Promise<TApodResponse> => {
  const params = {
    api_key: API_KEY,
    ...options,
  };
  try {
    const resp = await axios.get(APOD_API_URL, { params });
    const data = transformResponse(resp.data);
    saveToHistory(data);
    return data;
  } catch (error) {
    console.error(error);
    // @ts-expect-error
    return { error };
  }
};

export function getImageDimensions(loadedImage: HTMLImageElement) {
  let showFadedBackground = false;
  let backgroundSize = 'auto';

  const { width, height } = loadedImage;
  const { innerWidth, innerHeight } = window;
  const aspectRatio = width / height;

  const widthGtWindow = width > innerWidth;
  const heightGtWindow = height > innerHeight;

  const widthRatioMax = width / innerWidth > 0.5;
  const heightRatioMax = height / innerHeight > 0.5;

  if (widthGtWindow || heightGtWindow) {
    showFadedBackground = true;
    backgroundSize = aspectRatio >= 1.3 ? 'cover' : 'contain';
  } else if (widthRatioMax || heightRatioMax) {
    showFadedBackground = true;
  }

  return { showFadedBackground, backgroundSize };
}

// https://apod.nasa.gov/apod/calendar/S_011007.jpg
export function thumbSourceLink(date: string) {
  if (!date) return;

  return `https://apod.nasa.gov/apod/calendar/S_${linkDateFormat(date)}.jpg`;
}
