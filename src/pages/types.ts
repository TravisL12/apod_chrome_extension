import {
  IS_TODAY_APOD,
  HI_RES_ONLY,
  APOD_FAVORITES,
  SHOW_TOP_SITES,
  CURRENT_DATE,
  TODAY_COUNT,
  TODAY_LIMIT,
  IS_TODAY_LIMIT_ON,
  APOD_HISTORY,
  RANDOM_APODS,
  NEWTAB_VIEW,
  IMAGE_GRID_CACHE,
  GRID_AUTO_SCROLL,
  GRID_SEEN_IDS,
} from '../constants';

export type THistoryItem = {
  date: string;
  title: string;
  mediaType: string;
  url: string;
  dateAdded: number;
};

export type TFavoriteItem = {
  date: string;
  title: string;
  url?: string;
  imgUrl?: string;
};

export type TFavorites = { [date: string]: TFavoriteItem };

export type TNewtabView = 'apod' | 'grid';

/**
 * One tile in the image grid, flattened from an images-api search result.
 * `width`/`height` come back in the search response itself, so the masonry
 * layout is known before a single thumbnail is requested.
 */
export type TNasaImage = {
  nasaId: string;
  title: string;
  center?: string;
  dateCreated?: string;
  description?: string;
  thumbUrl: string;
  largeUrl: string;
  origUrl?: string;
  width: number;
  height: number;
};

export type TImageGridCache = {
  fetchedAt: number;
  items: TNasaImage[];
};

export type TAppOptions = {
  [APOD_FAVORITES]: TFavorites;
  [APOD_HISTORY]: THistoryItem[];
  [CURRENT_DATE]?: string;
  [HI_RES_ONLY]?: boolean;
  [IS_TODAY_APOD]: boolean;
  [IS_TODAY_LIMIT_ON]: boolean;
  [SHOW_TOP_SITES]?: boolean;
  [TODAY_COUNT]: number;
  [TODAY_LIMIT]: number;
  [RANDOM_APODS]?: TApodResponse[];
  [NEWTAB_VIEW]?: TNewtabView;
  [GRID_AUTO_SCROLL]?: boolean;
  // Kept out of LOCAL_OPTIONS alongside the grid cache: read on fetch only,
  // never needed by a new tab's initial options load.
  [GRID_SEEN_IDS]?: string[];
  // Like RANDOM_APODS: typed for the storage helpers, but kept out of
  // LOCAL_OPTIONS so `getAllChrome` does not pull it into every new tab.
  [IMAGE_GRID_CACHE]?: TImageGridCache;
};

export type TApodResponse = {
  copyright: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  loadedImage: HTMLImageElement;
  apodUrl: string;
  isToday: boolean;
  isImageHd?: boolean;
  error?: any;
  errorMessage?: string;
};

export type TUseNavigationProps = {
  response?: TApodResponse;
  fetchApod: (options?: TFetchOptions) => void;
  loadImage: (response: TApodResponse, forceHighDef?: boolean) => void;
  options: TAppOptions;
  toggleDrawer: (drawerOption: string | null) => void;
};

export type TTopSite = {
  url: string;
  title: string;
  // Firefox only, via `topSites.get({ includeFavicon: true })`: a data URL,
  // absent for sites it has no cached icon for.
  favicon?: string;
};

export type TFetchOptions = {
  random?: boolean;
  date?: any;
};

export type TNavigationButton = {
  label: string;
  isHidden: boolean;
  isFavorite?: boolean;
  clickHandler: () => void;
};

export type TDrawerProps = {
  drawerDisplay: string | null;
  isOpen: boolean;
  response?: TApodResponse;
  viewHistory: THistoryItem[];
  viewFavorites: TFavorites;
  toggleDrawer: TUseNavigationProps['toggleDrawer'];
  goToApodDate: (date: string) => void;
};
