export type TApodResponse = {
  copyright: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
};

export type TTopSite = {
  url: string;
  title: string;
};

export type TFetchOptions = {
  count?: number;
  date?: any;
};
