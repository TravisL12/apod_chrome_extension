export const APOD_API_URL = 'https://api.nasa.gov/planetary/apod';
export const API_KEY = 'hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447';

export const MIN_APOD_DATE = '1995-6-16';
export const DELAY_FOR_HD_LOAD = 1500;

export const MAX_ERROR_TRIES = 3;
export const ERROR_MESSAGE =
  'NASA APOD Error: Please reload or try Again Later';

export const TODAY = 'today';
export const RANDOM_APOD = 'random';

export const APOD_TYPE = 'apodType';
export const IS_TODAY_APOD = 'isTodayApod';
export const HI_RES_ONLY = 'hiResOnly';
export const APOD_FAVORITES = 'apodFavorites';
export const SHOW_TOP_SITES = 'showTopSites';
export const SHOW_HISTORY_ROW = 'showHistoryRow';
export const CURRENT_DATE = 'currentDate';
export const TODAY_COUNT = 'todayCount';
export const TODAY_LIMIT = 'todayLimit';
export const IS_TODAY_LIMIT_ON = 'isTodayLimitOn';

export const DRAWER_EXPLANATION = 'explanation';
export const DRAWER_FAVORITES = 'favorites';

export const APOD_OPTIONS = [
  APOD_TYPE,
  IS_TODAY_APOD,
  HI_RES_ONLY,
  APOD_FAVORITES,
  SHOW_TOP_SITES,
  SHOW_HISTORY_ROW,
  CURRENT_DATE,
  TODAY_COUNT,
  TODAY_LIMIT,
  IS_TODAY_LIMIT_ON,
];

export const KEY_MAP = {
  RANDOM_DAY: 'r',
  TODAY: 't',
  PREVIOUS_DAY: 'j',
  NEXT_DAY: 'k',
  EXPLANATION_TAB: 'e',
  FAVORITES_TAB: 'f',
  CLOSE_DRAWER: 'escape',
  // not used yet
  SEARCH_TAB: 's',
  PREVIOUS_HISTORY: 'ArrowLeft',
  NEXT_HISTORY: 'ArrowRight',
};

export const DEFAULT_OPTIONS = {
  [IS_TODAY_APOD]: false,
  [APOD_FAVORITES]: {},
  [HI_RES_ONLY]: false,
  [SHOW_TOP_SITES]: true,
  [SHOW_HISTORY_ROW]: true,
  [TODAY_COUNT]: 0,
  [TODAY_LIMIT]: 5,
  [IS_TODAY_LIMIT_ON]: false,
};
