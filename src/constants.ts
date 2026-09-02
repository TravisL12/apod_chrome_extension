import { TAppOptions } from './pages/types';

export const APOD_API_URL = 'https://api.nasa.gov/planetary/apod';
export const API_KEY = 'hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447';

export const MIN_APOD_DATE = `1995-6-16`;
// APOD publishes on US Eastern time, so "today" must follow that calendar.
export const APOD_TIME_ZONE = 'America/New_York';
export const DELAY_FOR_HD_LOAD = 1500;
export const HISTORY_LIMIT = 100;
export const RANDOM_FETCH_COUNT = 10;
export const RELOAD_RANDOM_LIMIT = 3;
export const TODAY_LIMIT_COUNT = 5;
// A run of `other` media types should not recurse forever.
export const MAX_OTHER_MEDIA_RETRIES = 5;

export const ERROR_MESSAGE =
  'NASA APOD Error: Please reload or try Again Later';

export const APOD_HISTORY = 'apodHistory';
export const IS_TODAY_APOD = 'isTodayApod';
export const HI_RES_ONLY = 'hiResOnly';
export const APOD_FAVORITES = 'apodFavorites';
export const SHOW_TOP_SITES = 'showTopSites';
export const CURRENT_DATE = 'currentDate';
export const TODAY_COUNT = 'todayCount';
export const TODAY_LIMIT = 'todayLimit';
export const IS_TODAY_LIMIT_ON = 'isTodayLimitOn';
export const RANDOM_APODS = 'randomApods';

export const DRAWER_EXPLANATION = 'explanation';
export const DRAWER_FAVORITES = 'favorites';
export const DRAWER_HISTORY = 'history';

// Settings live in `sync` so they follow the user between machines.
export const APOD_OPTIONS: (keyof TAppOptions)[] = [
  CURRENT_DATE,
  HI_RES_ONLY,
  IS_TODAY_APOD,
  IS_TODAY_LIMIT_ON,
  SHOW_TOP_SITES,
  TODAY_COUNT,
  TODAY_LIMIT,
];

// Collections live in `local`: `sync` caps every key at 8KB, which favorites
// blow past at roughly 50 saves.
export const LOCAL_OPTIONS: (keyof TAppOptions)[] = [
  APOD_FAVORITES,
  APOD_HISTORY,
];

export const KEY_MAP = {
  RANDOM_DAY: 'r',
  TODAY: 't',
  PREVIOUS_DAY: 'j',
  NEXT_DAY: 'k',
  EXPLANATION_TAB: 'e',
  FAVORITES_TAB: 'f',
  HISTORY_TAB: 'h',
  CLOSE_DRAWER: 'escape',
  PREVIOUS_HISTORY: 'ArrowRight',
  NEXT_HISTORY: 'ArrowLeft',
};

export const DEFAULT_OPTIONS = {
  [APOD_FAVORITES]: {},
  [APOD_HISTORY]: [],
  [HI_RES_ONLY]: false,
  [IS_TODAY_APOD]: false,
  [IS_TODAY_LIMIT_ON]: false,
  [SHOW_TOP_SITES]: true,
  [TODAY_COUNT]: 0,
  [TODAY_LIMIT]: TODAY_LIMIT_COUNT,
};
