import {
  RANDOM_APODS,
  REDUNDANT_RANDOM_URL,
  REDUNDANT_URL,
  RELOAD_RANDOM_LIMIT,
} from '../constants';
import axios from 'axios';
import { TApodResponse, TFetchOptions } from '../pages/types';
import { isDateToday, linkDateFormat } from './dates';
import {
  getLocalChrome,
  saveToHistory,
  setLocalChrome,
} from './chromeOperations';

let isReloadingCache = false;
const reloadCache = async () => {
  const resp = await axios.get(REDUNDANT_RANDOM_URL);
  const images = resp.data.map((item: TApodResponse) => {
    const data = transformResponse(item);
    return {
      date: data.date,
      title: data.title,
      media_type: data.media_type,
      url: data.url,
    };
  });

  getLocalChrome([RANDOM_APODS], (options) => {
    const cache = options[RANDOM_APODS];
    setLocalChrome({ [RANDOM_APODS]: [...images, ...cache] });
    isReloadingCache = false;
  });
};

const randomCache = (): Promise<TApodResponse> => {
  return new Promise((resolve) => {
    getLocalChrome([RANDOM_APODS], (options) => {
      const cache = [...(options[RANDOM_APODS] || [])];
      const item = cache.pop();
      setLocalChrome({ [RANDOM_APODS]: cache });

      if (item) {
        saveToHistory(item);

        if (cache.length < RELOAD_RANDOM_LIMIT && !isReloadingCache) {
          isReloadingCache = true;
          reloadCache();
        }
      }

      resolve(item);
    });
  });
};

export const preloadImage = (url: string) => {
  const img = new Image();
  img.src = url;
  return img;
};

export const trimDateString = (date: string): string => {
  return date.replaceAll('-0', '-');
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
  data.apodUrl =
    data.apodLink ||
    `https://apod.nasa.gov/apod/ap${linkDateFormat(data.date)}.html`;
  data.date = trimDateString(data.date);
  data.isToday = isDateToday(data.date);
  return data;
};
export const fetchRandomImage = async (): Promise<TApodResponse> => {
  try {
    // Look in cache
    const cacheResp = await randomCache();
    if (cacheResp) {
      const resp = await fetchImage({ date: cacheResp.date });
      return resp;
    }

    // Otherwise fetch
    const { data } = await axios.get(REDUNDANT_RANDOM_URL);
    const images = data.map((item: TApodResponse) => transformResponse(item));

    return new Promise((resolve) => {
      setLocalChrome({ [RANDOM_APODS]: images }, async () => {
        const response = await randomCache();
        const resp = await fetchImage({ date: response.date });
        resolve(resp);
      });
    });
  } catch (error) {
    // @ts-expect-error
    return { error };
  }
};

export const fetchImage = async (
  fetchOptions: TFetchOptions = {}
): Promise<TApodResponse> => {
  try {
    const resp = await axios.get(REDUNDANT_URL, { params: fetchOptions });
    const data = transformResponse(resp.data);
    saveToHistory(data);
    return data;
  } catch (error) {
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
