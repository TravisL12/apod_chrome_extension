import {
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
  APOD_HISTORY,
} from '../constants';

type TFavorites = {
  url?: string;
  title?: string;
};

export type TAppOptions = {
  [APOD_TYPE]?: string;
  [IS_TODAY_APOD]?: boolean;
  [HI_RES_ONLY]?: TFavorites;
  [APOD_FAVORITES]?: any;
  [SHOW_TOP_SITES]?: boolean;
  [SHOW_HISTORY_ROW]?: boolean;
  [CURRENT_DATE]?: string;
  [TODAY_COUNT]?: number;
  [TODAY_LIMIT]?: number;
  [IS_TODAY_LIMIT_ON]?: boolean;
  [APOD_HISTORY]?: any;
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

export type TApodBodyProps = {
  options: TAppOptions;
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
