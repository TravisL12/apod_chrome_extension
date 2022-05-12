import {
  APOD_TYPE,
  IS_TODAY_APOD,
  HI_RES_ONLY,
  APOD_FAVORITES,
  SHOW_TOP_SITES,
  CURRENT_DATE,
  TODAY_COUNT,
  TODAY_LIMIT,
  IS_TODAY_LIMIT_ON,
  APOD_HISTORY,
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

export type TAppOptions = {
  [APOD_FAVORITES]: TFavorites;
  [APOD_HISTORY]: THistoryItem[];
  [APOD_TYPE]?: string;
  [CURRENT_DATE]?: string;
  [HI_RES_ONLY]?: boolean;
  [IS_TODAY_APOD]: boolean;
  [IS_TODAY_LIMIT_ON]: boolean;
  [SHOW_TOP_SITES]?: boolean;
  [TODAY_COUNT]: number;
  [TODAY_LIMIT]: number;
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
