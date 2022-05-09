import {
  API_KEY,
  APOD_API_URL,
  RANDOM_APODS,
  RANDOM_FETCH_COUNT,
} from '../constants';
import axios from 'axios';
import { TApodResponse, TFetchOptions } from '../pages/types';
import { isDateToday, linkDateFormat } from './dates';
import {
  getLocalChrome,
  saveToHistory,
  setLocalChrome,
} from './chromeOperations';

const randomCache = (): Promise<TApodResponse> => {
  return new Promise((resolve) => {
    getLocalChrome([RANDOM_APODS], (options) => {
      const cache = [...(options[RANDOM_APODS] || [])];
      const item = cache.pop();
      setLocalChrome({ [RANDOM_APODS]: cache });

      if (item) {
        saveToHistory(item);
      }

      resolve(item);
    });
  });
};

const preloadImage = (url: string) => {
  const img = new Image();
  img.src = url;
};

const transformResponse = (data: TApodResponse) => {
  // Some URL's are cutoff and start with `//www.youtube...`
  if (/^\/\//.test(data.url)) {
    data.url = `https:${data.url}`;
  }

  if (data.media_type === 'image') {
    preloadImage(data.url);
    preloadImage(data.hdurl);
  }
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
    count: RANDOM_FETCH_COUNT,
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
