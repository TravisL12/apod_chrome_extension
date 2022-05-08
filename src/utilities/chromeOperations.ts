import { APOD_FAVORITES, APOD_HISTORY, HISTORY_LIMIT } from '../constants';
import { TApodResponse } from '../pages/types';

export const getChrome = (options: any, callback: (params?: any) => void) => {
  chrome.storage.sync.get(options, callback);
};

export const setChrome = (options: any, callback?: (params?: any) => void) => {
  chrome.storage.sync.set(options, callback);
};

export const onChangeChrome = (callback: (params?: any) => void) => {
  chrome.storage.onChanged.addListener(callback);
};

// LOCAL STORAGE
export const getLocalChrome = (
  options: any,
  callback: (params?: any) => void
) => {
  chrome.storage.local.get(options, callback);
};

export const setLocalChrome = (
  options: any,
  callback?: (params?: any) => void
) => {
  chrome.storage.local.set(options, callback);
};

export const saveToHistory = (response?: TApodResponse) => {
  getLocalChrome([APOD_HISTORY], (options) => {
    const prevHistory = options?.[APOD_HISTORY] || [];
    const respNoExplanation = {
      date: response?.date,
      title: response?.title,
      mediaType: response?.media_type,
      url: response?.url,
      dateAdded: new Date().getTime(),
    };
    const newHistory = [...prevHistory, respNoExplanation]
      .slice(-HISTORY_LIMIT)
      .sort((a, b) => b.dateAdded - a.dateAdded);

    setLocalChrome({
      [APOD_HISTORY]: newHistory,
    });
  });
};

export const removeFavorite = (date: string) => {
  getChrome([APOD_FAVORITES], (options) => {
    const prevFavorites = options?.[APOD_FAVORITES] || {};
    delete prevFavorites[date];
    setChrome({
      [APOD_FAVORITES]: prevFavorites,
    });
  });
};

export const saveFavorite = (response?: TApodResponse) => {
  if (!response) {
    return;
  }

  getChrome([APOD_FAVORITES], (options) => {
    const prevFavorites = options?.[APOD_FAVORITES] || {};

    if (prevFavorites[response.date]) {
      removeFavorite(response.date);
      return;
    }

    const newItem = {
      date: response.date,
      title: response.title,
      url: response.url,
    };
    const newFavorites = { ...prevFavorites, [response.date]: newItem };
    setChrome({
      [APOD_FAVORITES]: newFavorites,
    });
  });
};
