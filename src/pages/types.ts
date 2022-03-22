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
