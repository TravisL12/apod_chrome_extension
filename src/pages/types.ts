export type TAppOptions = {
  apodType?: string;
  apodFavorites?: {
    url?: string;
    title?: string;
  };
  hiResOnly?: boolean;
  showTopSites?: boolean;
  showHistoryRow?: boolean;
  currentDate?: string;
  todayCount?: number;
  todayLimit?: number;
  isTodayLimitOn?: boolean;
};

export type TApodBodyProps = {
  isHighDef?: boolean; // will be passed in by preferences
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
};

export type TUseNavigationProps = {
  response?: TApodResponse;
  fetchApod: (options?: TFetchOptions) => void;
  loadImage: (response: TApodResponse, forceHighDef?: boolean) => void;
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
