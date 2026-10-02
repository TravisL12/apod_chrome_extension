import {
  APOD_API_URL,
  RANDOM_APODS,
  RANDOM_FETCH_COUNT,
  RELOAD_RANDOM_LIMIT,
} from '../constants';
import axios from 'axios';
import {
  TApodBasicResponse,
  TApodResponse,
  TFetchOptions,
} from '../pages/types';
import { isDateToday, linkDateFormat } from './dates';
import {
  getLocalChrome,
  saveToHistory,
  setLocalChrome,
} from './chromeOperations';

const parseHtml = (html: string = '') =>
  new DOMParser().parseFromString(html, 'text/html');

// Everything after the first break is site boilerplate ("Tomorrow's picture",
// gallery and social links) that the old API never included. The markup also
// leaves a space between each link and the punctuation after it.
const explanationText = (html: string = '') => {
  const [body] = html.split(/<br\s*\/?>/i);
  return (parseHtml(body).body.textContent || '')
    .replace(/^\s*Explanation:\s*/i, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?)])/g, '$1')
    .trim();
};

const FULL_RES_IMAGE = /\.(jpe?g|png|gif|webp|tiff?)(\?|$)/i;
const STANDARD_WIDTH = 1920;

// `dynamicimage` URLs are resized on request, so a standard-res copy is just
// the same path at a smaller width. The full one can run to tens of MB.
const standardResUrl = (hdurl: string) => {
  if (!hdurl.includes('/dynamicimage/')) {
    return hdurl;
  }
  const url = new URL(hdurl);
  url.search = `?w=${STANDARD_WIDTH}&fit=clip`;
  return url.toString();
};

/**
 * science.nasa.gov's `url` is the article page, not the media, and its
 * `hdurl` is a still -- or for the earliest entries a generic placeholder.
 * The real image and video sources appear in the post's `basic_html`, so
 * read them from there and rebuild the shape the old API returned.
 */
const toApodResponse = (item: TApodBasicResponse): TApodResponse => {
  const doc = parseHtml(item.basic_html);
  const image = doc.querySelector('img');
  const video = doc.querySelector('iframe[src], video[src], video source[src]');

  // Some posts leave the `<img>` out of `basic_html` entirely; for those the
  // top-level `hdurl` is the only image source.
  const fallbackUrl =
    item.media_type === 'image' && !image && item.hdurl ? item.hdurl : '';
  const imageUrl =
    image?.getAttribute('src') || (fallbackUrl && standardResUrl(fallbackUrl));
  const videoUrl = video?.getAttribute('src') || '';
  // Clicking an APOD image opens the full-resolution file.
  const fullUrl = image?.closest('a')?.getAttribute('href') || fallbackUrl;

  const isVideo = item.media_type === 'video' && !!videoUrl;
  const isImage = item.media_type === 'image' && !!imageUrl;

  // The client-only fields (`isToday`, `loadedImage`, ...) are added later.
  return {
    date: item.date,
    title: item.title,
    copyright: parseHtml(item.copyright).body.textContent?.trim() || '',
    explanation: explanationText(item.explanation),
    // Anything unrenderable becomes `other`, which rolls a random APOD.
    media_type: isVideo ? 'video' : isImage ? 'image' : 'other',
    url: isVideo ? videoUrl : imageUrl,
    hdurl: isImage && FULL_RES_IMAGE.test(fullUrl) ? fullUrl : imageUrl,
    apodUrl: item.permalink,
  } as TApodResponse;
};

const getApods = async (params: object): Promise<TApodResponse[]> => {
  const resp = await axios.get<TApodBasicResponse[]>(APOD_API_URL, {
    params,
  });
  return resp.data.map(toApodResponse);
};

// No random endpoint: pick random single-entry pages out of the archive's
// total, which only needs looking up once per page load.
let archiveTotal: number | undefined;
const getArchiveTotal = async (): Promise<number> => {
  if (!archiveTotal) {
    const resp = await axios.get(APOD_API_URL, { params: { per_page: 1 } });
    archiveTotal = Number(resp.headers['x-wp-total']) || 0;
  }
  return archiveTotal;
};

const fetchRandomApods = async (): Promise<TApodResponse[]> => {
  const total = await getArchiveTotal();
  const pages = Array.from(
    { length: RANDOM_FETCH_COUNT },
    () => Math.floor(Math.random() * total) + 1
  );
  // One failed page should not cost the whole batch.
  const results = await Promise.allSettled(
    pages.map((page) => getApods({ per_page: 1, page }))
  );
  const apods = results.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : []
  );
  if (apods.length === 0) {
    throw new Error('APOD: no random entries returned');
  }
  return apods.map(transformResponse);
};

let isReloadingCache = false;
const reloadCache = async () => {
  try {
    const images = await fetchRandomApods();

    getLocalChrome([RANDOM_APODS], (options) => {
      const cache = options?.[RANDOM_APODS] || [];
      setLocalChrome({ [RANDOM_APODS]: [...images, ...cache] });
      isReloadingCache = false;
    });
  } catch (error) {
    // Leaving the flag set would block every future refill for the life of
    // the page, so the cache could drain to empty and never recover.
    isReloadingCache = false;
    console.error('APOD: random cache refill failed', error);
  }
};

const randomCache = (): Promise<TApodResponse> => {
  return new Promise((resolve) => {
    getLocalChrome([RANDOM_APODS], (options) => {
      const cache = [...(options?.[RANDOM_APODS] || [])];
      const item = cache.pop();

      if (item) {
        setLocalChrome({ [RANDOM_APODS]: cache });
        saveToHistory(item);

        if (cache.length < RELOAD_RANDOM_LIMIT && !isReloadingCache) {
          isReloadingCache = true;
          reloadCache();
        }
      }

      resolve(item);
    });
  });
};

export const preloadImage = (url: string) => {
  const img = new Image();
  img.src = url;
  return img;
};

export const trimDateString = (date: string): string => {
  return date.replaceAll('-0', '-');
};

const transformResponse = (data: TApodResponse) => {
  // Some URL's are cutoff and start with `//www.youtube...`
  if (/^\/\//.test(data.url)) {
    data.url = `https:${data.url}`;
  }

  if (data.media_type === 'image') {
    preloadImage(data.url);
    // Not every entry has an hdurl; preloading `undefined` just fires a
    // guaranteed 404.
    if (data.hdurl) {
      preloadImage(data.hdurl);
    }
  }
  data.date = trimDateString(data.date);
  data.isToday = isDateToday(data.date);
  return data;
};
export const fetchRandomImage = async (): Promise<TApodResponse> => {
  try {
    // Look in cache
    const cacheResp = await randomCache();
    if (cacheResp) {
      return cacheResp;
    }

    // Otherwise fetch
    const images = await fetchRandomApods();

    return new Promise((resolve) => {
      setLocalChrome({ [RANDOM_APODS]: images }, async () => {
        const response = await randomCache();
        resolve(response);
      });
    });
  } catch (error) {
    // @ts-expect-error
    return { error };
  }
};

export const fetchImage = async (
  fetchOptions: TFetchOptions = {}
): Promise<TApodResponse> => {
  // Dates go over the wire as `YYMMDD`; with none, the newest entry comes
  // first.
  const { date } = fetchOptions;
  const params = date
    ? { date_from: linkDateFormat(date), date_to: linkDateFormat(date) }
    : { per_page: 1 };
  try {
    const [apod] = await getApods(params);
    if (!apod) {
      throw new Error(`APOD: no entry for ${date || 'today'}`);
    }
    const data = transformResponse(apod);
    saveToHistory(data);
    return data;
  } catch (error) {
    // @ts-expect-error
    return { error };
  }
};

export function getImageDimensions(loadedImage: HTMLImageElement) {
  let showFadedBackground = false;
  let backgroundSize = 'auto';

  const { width, height } = loadedImage;
  const { innerWidth, innerHeight } = window;
  const aspectRatio = width / height;

  const widthGtWindow = width > innerWidth;
  const heightGtWindow = height > innerHeight;

  const widthRatioMax = width / innerWidth > 0.5;
  const heightRatioMax = height / innerHeight > 0.5;

  if (widthGtWindow || heightGtWindow) {
    showFadedBackground = true;
    backgroundSize = aspectRatio >= 1.3 ? 'cover' : 'contain';
  } else if (widthRatioMax || heightRatioMax) {
    showFadedBackground = true;
  }

  return { showFadedBackground, backgroundSize };
}

// https://apod.nasa.gov/apod/calendar/S_011007.jpg
export function thumbSourceLink(date: string) {
  if (!date) return;

  return `https://apod.nasa.gov/apod/calendar/S_${linkDateFormat(date)}.jpg`;
}
