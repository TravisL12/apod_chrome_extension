import {
  APOD_OPTIONS,
  APOD_FAVORITES,
  APOD_HISTORY,
  HISTORY_LIMIT,
  LOCAL_OPTIONS,
} from '../constants';
import {
  TApodResponse,
  TAppOptions,
  TFavoriteItem,
  TFavorites,
  THistoryItem,
} from '../pages/types';

export const getChrome = (
  options: (keyof TAppOptions)[],
  callback: (params?: any) => void
) => {
  chrome.storage.sync.get(options, callback);
};

export const setChrome = (
  options: { [key: string]: any },
  callback?: (params?: any) => void
) => {
  chrome.storage.sync.set(options, callback);
};

export const onChangeChrome = (callback: (params?: any) => void) => {
  chrome.storage.onChanged.addListener(callback);
};

// LOCAL STORAGE
export const getLocalChrome = (
  options: (keyof TAppOptions)[],
  callback: (params?: any) => void
) => {
  chrome.storage.local.get(options, callback);
};

export const setLocalChrome = (
  options: { [key: string]: any },
  callback?: (params?: any) => void
) => {
  chrome.storage.local.set(options, callback);
};

/**
 * Favorites used to live in `sync`, which caps each key at 8KB -- about 50
 * saves before every further save failed. Move any leftovers into `local`
 * (10MB) once, merging rather than overwriting so a half-synced machine
 * cannot drop entries.
 */
const migrateFavorites = (done: () => void) => {
  getChrome([APOD_FAVORITES], (syncOptions) => {
    const syncFavorites: TFavorites = syncOptions?.[APOD_FAVORITES] || {};

    if (Object.keys(syncFavorites).length === 0) {
      done();
      return;
    }

    getLocalChrome([APOD_FAVORITES], (localOptions) => {
      const localFavorites: TFavorites = localOptions?.[APOD_FAVORITES] || {};

      setLocalChrome(
        { [APOD_FAVORITES]: { ...syncFavorites, ...localFavorites } },
        () => {
          // Only reclaim the sync quota once the local write succeeded.
          if (chrome.runtime.lastError) {
            done();
            return;
          }
          chrome.storage.sync.remove(APOD_FAVORITES, done);
        }
      );
    });
  });
};

// Combine sync and local storages
export const getAllChrome = (cb: (options: any) => void) => {
  migrateFavorites(() => {
    getChrome(APOD_OPTIONS, (options) => {
      getLocalChrome(LOCAL_OPTIONS, (localOptions) => {
        cb({ ...options, ...localOptions });
      });
    });
  });
};

export const saveToHistory = (response: TApodResponse) => {
  getLocalChrome([APOD_HISTORY], (options) => {
    const prevHistory: THistoryItem[] = options?.[APOD_HISTORY] || [];

    const doesExist = prevHistory.some((hist) => hist.date === response.date);
    if (doesExist) {
      return;
    }

    const respNoExplanation: THistoryItem = {
      date: response.date,
      title: response.title,
      mediaType: response.media_type,
      url: response.url,
      dateAdded: Date.now(),
    };

    // Already sorted newest-first, so prepending keeps the order.
    const newHistory = [respNoExplanation, ...prevHistory].slice(
      0,
      HISTORY_LIMIT
    );

    setLocalChrome({
      [APOD_HISTORY]: newHistory,
    });
  });
};

export const removeFavorite = (date: string) => {
  getLocalChrome([APOD_FAVORITES], (options) => {
    const prevFavorites: TFavorites = options?.[APOD_FAVORITES] || {};
    delete prevFavorites[date];
    setLocalChrome({
      [APOD_FAVORITES]: prevFavorites,
    });
  });
};

export const saveFavorite = (response?: TApodResponse) => {
  if (!response) {
    return;
  }

  getLocalChrome([APOD_FAVORITES], (options) => {
    const prevFavorites: TFavorites = options?.[APOD_FAVORITES] || {};

    if (prevFavorites[response.date]) {
      removeFavorite(response.date);
      return;
    }

    const newItem: TFavoriteItem = {
      date: response.date,
      title: response.title,
      url: response.url,
    };
    const newFavorites = { ...prevFavorites, [response.date]: newItem };

    setLocalChrome(
      {
        [APOD_FAVORITES]: newFavorites,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            'APOD: saving favorite failed',
            chrome.runtime.lastError
          );
        }
      }
    );
  });
};
