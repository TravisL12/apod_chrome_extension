type TFavorites = {
  url?: string;
  title?: string;
};

export type TAppOptions = {
  apodType?: string;
  isTodayApod?: boolean;
  apodFavorites?: TFavorites;
  hiResOnly?: boolean;
  showTopSites?: boolean;
  showHistoryRow?: boolean;
  currentDate?: string;
  todayCount?: number;
  todayLimit?: number;
  isTodayLimitOn?: boolean;
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
  count?: number;
  date?: any;
};

export type TNavigationButton = {
  label: string;
  clickHandler: () => void;
  isHidden: boolean;
};
