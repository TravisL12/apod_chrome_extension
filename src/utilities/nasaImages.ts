import axios from 'axios';
import {
  GRID_CACHE_TTL,
  GRID_MAX_PAGE,
  GRID_PAGE_SIZE,
  GRID_QUERIES,
  GRID_POOL_SIZE,
  IMAGE_GRID_CACHE,
  NASA_IMAGES_API_URL,
} from '../constants';
import { TImageGridCache, TNasaImage } from '../pages/types';
import { getLocalChrome, setLocalChrome } from './chromeOperations';

// How many curated subjects a single grid is mixed from.
const QUERIES_PER_FETCH = 3;

/**
 * Kennedy Space Center's archive is launch-ground operations -- crates,
 * technicians, prelaunch processing -- and most of it is filed under a bare
 * ID (`KSC-06pd2785`) that no title-based rule can catch. It contributes
 * nothing to a wall of space imagery.
 */
const EXCLUDED_CENTERS = ['KSC'];

/**
 * Even a curated subject turns up the occasional press event or hardware
 * shot, which reads as noise on a wall of space imagery. Matching on the
 * title catches them cheaply.
 *
 * Deliberately narrow: terms like `crew` and `portrait` would also throw out
 * the ISS aurora photography and planetary family portraits, which are
 * exactly what the grid is for.
 */
const NON_CELESTIAL_TITLE =
  /\b(briefing|press conference|news conference|town hall|media day|rollout|prelaunch|launch pad|administrator|technician|clean ?room|employee|ceremony|interview|training|award|logo|patch|signing|expo|exhibit|booth|workshop|meeting|groundbreaking|test stand|hangar)\b/i;

type TApiLink = {
  href: string;
  render?: string;
  width?: number;
  height?: number;
  size?: number;
};

type TApiItem = {
  href: string;
  data: {
    nasa_id: string;
    title: string;
    center?: string;
    date_created?: string;
    description?: string;
    media_type: string;
  }[];
  links?: TApiLink[];
};

export const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Renditions are identified by a `~tag` suffix on the asset filename, and not
 * every asset has every one -- `thumb` and `orig` are the only two present on
 * every result, so everything else needs a fallback chain.
 */
const byRendition = (links: TApiLink[]): { [tag: string]: TApiLink } => {
  return links.reduce((acc: { [tag: string]: TApiLink }, link) => {
    const match = /~(thumb|small|medium|large|orig)\./.exec(link.href || '');
    if (match) {
      acc[match[1]] = link;
    }
    return acc;
  }, {});
};

const normalizeItem = (item: TApiItem): TNasaImage | null => {
  const data = item?.data?.[0];
  const links = item?.links || [];
  if (!data || data.media_type !== 'image' || links.length === 0) {
    return null;
  }

  if (
    EXCLUDED_CENTERS.includes(data.center || '') ||
    NON_CELESTIAL_TITLE.test(data.title || '')
  ) {
    return null;
  }

  const rendition = byRendition(links);
  const thumb = rendition.thumb || rendition.small || rendition.medium;
  if (!thumb) {
    return null;
  }

  // `orig` frequently omits dimensions, so read them off whichever rendition
  // carries them. Without a ratio the tile cannot be laid out, so skip.
  const sized = [
    rendition.thumb,
    rendition.small,
    rendition.medium,
    rendition.large,
    rendition.orig,
  ].find((link) => link?.width && link?.height);

  if (!sized?.width || !sized?.height) {
    return null;
  }

  return {
    nasaId: data.nasa_id,
    title: data.title,
    center: data.center,
    dateCreated: data.date_created,
    description: data.description,
    thumbUrl: thumb.href,
    largeUrl: (rendition.large || rendition.medium || thumb).href,
    origUrl: rendition.orig?.href,
    width: sized.width,
    height: sized.height,
  };
};

const searchQuery = async (query: string): Promise<TNasaImage[]> => {
  const params = {
    q: query,
    media_type: 'image',
    page_size: GRID_PAGE_SIZE,
    page: Math.floor(Math.random() * GRID_MAX_PAGE) + 1,
  };

  const request = (requestParams: typeof params) =>
    axios.get(NASA_IMAGES_API_URL, { params: requestParams });

  let resp = await request(params);
  // Shallow pools run out well before GRID_MAX_PAGE; page 1 always exists.
  if (!resp.data?.collection?.items?.length && params.page !== 1) {
    resp = await request({ ...params, page: 1 });
  }

  const items: TApiItem[] = resp.data?.collection?.items || [];
  return items
    .map(normalizeItem)
    .filter((item): item is TNasaImage => item !== null);
};

/**
 * Mixes a few curated subjects into one set. A subject that fails is dropped
 * rather than failing the whole grid -- a partial wall still renders.
 *
 * `alreadyShown` holds what the wall is already displaying, so appending a
 * batch to an endlessly scrolling wall cannot repeat a tile the viewer has
 * scrolled past.
 */
export const fetchImageGrid = async (
  alreadyShown: TNasaImage[] = []
): Promise<TNasaImage[]> => {
  const queries = shuffle(GRID_QUERIES).slice(0, QUERIES_PER_FETCH);

  const results = await Promise.all(
    queries.map(async (query) => {
      try {
        return await searchQuery(query);
      } catch (error) {
        console.error(`APOD: image grid search failed for "${query}"`, error);
        return [] as TNasaImage[];
      }
    })
  );

  const seenIds = new Set<string>(alreadyShown.map((item) => item.nasaId));
  const seenTitles = new Set<string>(
    alreadyShown.map((item) => (item.title || '').trim().toLowerCase())
  );
  const merged = results.flat().filter((item) => {
    // The same asset surfaces under more than one subject, which would tile
    // it twice. The archive also holds the same photograph under several ids
    // at different crops, so the title is deduped alongside the id.
    const title = (item.title || '').trim().toLowerCase();
    if (seenIds.has(item.nasaId) || seenTitles.has(title)) {
      return false;
    }
    seenIds.add(item.nasaId);
    seenTitles.add(title);
    return true;
  });

  return shuffle(merged).slice(0, GRID_POOL_SIZE);
};

export const readGridCache = (): Promise<TImageGridCache | undefined> => {
  return new Promise((resolve) => {
    getLocalChrome([IMAGE_GRID_CACHE], (options) => {
      resolve(options?.[IMAGE_GRID_CACHE]);
    });
  });
};

export const writeGridCache = (items: TNasaImage[]) => {
  const cache: TImageGridCache = { fetchedAt: Date.now(), items };
  setLocalChrome({ [IMAGE_GRID_CACHE]: cache });
};

export const isGridCacheStale = (cache?: TImageGridCache): boolean => {
  if (!cache?.items?.length) {
    return true;
  }
  return Date.now() - cache.fetchedAt > GRID_CACHE_TTL;
};

/**
 * Splits a set of tiles into `columnCount` balanced columns, keeping reading
 * order down each column. Column heights are tracked as summed aspect ratios
 * (height per unit width), which is all that matters since every column is
 * the same width.
 */
export const splitIntoColumns = (
  items: TNasaImage[],
  columnCount: number
): TNasaImage[][] => {
  const columns: TNasaImage[][] = Array.from({ length: columnCount }, () => []);
  const heights = new Array(columnCount).fill(0);

  items.forEach((item) => {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push(item);
    heights[shortest] += item.height / item.width;
  });

  return columns;
};
