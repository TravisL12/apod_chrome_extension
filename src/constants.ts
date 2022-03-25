export const APOD_API_URL = 'https://api.nasa.gov/planetary/apod';
export const API_KEY = 'hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447';

export const MIN_APOD_DATE = '1995-6-16';
export const DELAY_FOR_HD_LOAD = 1500;

export const TODAY = 'today';
export const RANDOM_APOD = 'random';

export const APOD_TYPE = 'apodType';
export const HI_RES_ONLY = 'hiResOnly';
export const APOD_FAVORITES = 'apodFavorites';
export const SHOW_TOP_SITES = 'showTopSites';
export const SHOW_HISTORY_ROW = 'showHistoryRow';
export const CURRENT_DATE = 'currentDate';
export const TODAY_COUNT = 'todayCount';
export const TODAY_LIMIT = 'todayLimit';
export const IS_TODAY_LIMIT_ON = 'isTodayLimitOn';

export const APOD_OPTIONS = [
  APOD_TYPE,
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
  // not used yet
  EXPLANATION_TAB: 'e',
  FAVORITES_TAB: 'f',
  SEARCH_TAB: 's',
  CLOSE_DRAWER: 'esc',
  PREVIOUS_HISTORY: 'ArrowLeft',
  NEXT_HISTORY: 'ArrowRight',
};

export const DEFAULT_OPTIONS = {
  apodType: RANDOM_APOD,
  apodFavorites: {},
  hiResOnly: false,
  showTopSites: true,
  showHistoryRow: true,
  todayCount: 0,
  todayLimit: 5,
  isTodayLimitOn: false,
};
