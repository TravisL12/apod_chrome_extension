import { API_KEY, APOD_API_URL } from '../constants';
import axios from 'axios';
import { TFetchOptions } from '../pages/types';
import { isDateToday, linkDateFormat } from './dates';

export const fetchImage = async (options: TFetchOptions = {}) => {
  const params = {
    api_key: API_KEY,
    ...options,
  };
  try {
    const resp = await axios.get(APOD_API_URL, { params });
    const data = resp.data[0] || resp.data;
    data.apodUrl = `https://apod.nasa.gov/apod/ap${linkDateFormat(
      data.date
    )}.html`;
    data.date = data.date.replace('-0', '-');
    data.isToday = isDateToday(data.date);

    return data;
  } catch (error) {
    console.error(error);
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
