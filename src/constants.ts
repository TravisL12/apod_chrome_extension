import { TAppOptions } from './pages/types';

export const APOD_API_URL = 'https://api.nasa.gov/planetary/apod';
// The NASA Image and Video Library: NASA-produced (public domain) mission and
// observatory imagery. Unrelated to APOD, and it needs no API key.
export const NASA_IMAGES_API_URL = 'https://images-api.nasa.gov/search';
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
export const NEWTAB_VIEW = 'newtabView';
export const IMAGE_GRID_CACHE = 'imageGridCache';
export const GRID_AUTO_SCROLL = 'gridAutoScroll';

// `as const` so DEFAULT_OPTIONS keeps the literal type TNewtabView expects.
export const VIEW_APOD = 'apod' as const;
export const VIEW_GRID = 'grid' as const;

// How many tiles the wall shows at first, and how many each append adds.
export const GRID_BATCH_SIZE = 48;
// A fetch keeps far more than it shows. The pool is cached and reshuffled on
// every new tab, so each tab draws a different wall out of it without going
// back to the network.
export const GRID_POOL_SIZE = 200;
// `page_size` maxes out at 100.
export const GRID_PAGE_SIZE = 100;
// Deep pages get thin and repetitive, and most subjects have only a few
// hundred results, so vary within the first few only.
export const GRID_MAX_PAGE = 4;
// Thumbnails are re-fetched on every paint, so keep a set around for a while
// rather than hitting the API on each new tab.
export const GRID_CACHE_TTL = 1000 * 60 * 60 * 6;

// The wall appends a batch as the viewer nears the bottom. Every tile stays
// in the DOM, so this caps how far it will grow: ~200 tiles is far more than
// a new tab is ever scrolled through, while keeping decoded-image memory
// bounded on a tab left open all day.
export const GRID_MAX_TILES = 200;
// How close to the bottom (in viewport heights) before the next batch loads.
// Loading a full screen early keeps the auto-scroll from reaching an edge.
export const GRID_LOAD_MORE_THRESHOLD = 1.5;

// Auto-scroll drifts at a readable pace rather than a visible crawl.
export const AUTO_SCROLL_PIXELS_PER_SECOND = 22;
// How long after the viewer stops interacting before the drift resumes.
export const AUTO_SCROLL_RESUME_DELAY = 3000;

// Open-ended searches drag in org charts, press conferences and hardware on
// test stands, so the grid only ever draws from curated subjects. These are
// picked by subject rather than by instrument: searching an instrument by
// name ("james webb") returns mostly mission and hardware photography.
export const GRID_QUERIES = [
  'nebula',
  'planetary nebula',
  'galaxy',
  'spiral galaxy',
  'galaxy cluster',
  'star cluster',
  'globular cluster',
  'star forming region',
  'supernova',
  'supernova remnant',
  'milky way',
  'hubble deep field',
  'hubble image',
  'aurora',
  'solar flare',
  'saturn',
  'jupiter',
  'mars surface',
  'earth from space',
];

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
  NEWTAB_VIEW,
  GRID_AUTO_SCROLL,
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
  [NEWTAB_VIEW]: VIEW_APOD,
  [GRID_AUTO_SCROLL]: true,
};
