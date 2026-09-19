import axios from 'axios';
import {
  GRID_CACHE_TTL,
  GRID_PAGE_LIMIT,
  GRID_PAGE_SIZE,
  GRID_MAX_FETCH_ROUNDS,
  GRID_POOL_MIN,
  GRID_POOL_SIZE,
  GRID_QUERIES,
  GRID_SEEN_IDS,
  GRID_SEEN_LIMIT,
  IMAGE_GRID_CACHE,
  NASA_IMAGES_API_URL,
} from '../constants';
import { TImageGridCache, TNasaImage } from '../pages/types';
import { getLocalChrome, setLocalChrome } from './chromeOperations';

// How many curated subjects one round mixes. The searches run in parallel,
// so a wide round costs roughly what a narrow one does, and drawing from
// more subjects is what keeps a single pool from being all one thing.
const QUERIES_PER_FETCH = 8;

/**
 * The most tiles any one subject may put into a pool.
 *
 * Without this a broad subject returns a full page while a narrow one returns
 * a handful, so one subject could take half the pool -- and since the pool is
 * cached and resampled for hours, every tab would keep showing that subject.
 */
const perQueryCap = Math.ceil(GRID_POOL_SIZE / QUERIES_PER_FETCH);

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

/**
 * Picks a page from anywhere in a subject's results.
 *
 * The page has to be chosen against the real result count, which is only
 * known once something has been asked for -- hence the one-item probe. Paging
 * blindly within the first few hundred reached about a tenth of the archive
 * and was the main reason a refresh kept turning up the same pictures.
 */
const searchQuery = async (query: string): Promise<TNasaImage[]> => {
  const baseParams = { q: query, media_type: 'image' };

  const probe = await axios.get(NASA_IMAGES_API_URL, {
    params: { ...baseParams, page_size: 1 },
  });

  const totalHits: number = probe.data?.collection?.metadata?.total_hits || 0;
  if (!totalHits) {
    return [];
  }

  const lastPage = Math.min(
    Math.ceil(totalHits / GRID_PAGE_SIZE),
    GRID_PAGE_LIMIT
  );

  const resp = await axios.get(NASA_IMAGES_API_URL, {
    params: {
      ...baseParams,
      page_size: GRID_PAGE_SIZE,
      page: Math.floor(Math.random() * lastPage) + 1,
    },
  });

  const items: TApiItem[] = resp.data?.collection?.items || [];
  return items
    .map(normalizeItem)
    .filter((item): item is TNasaImage => item !== null);
};

/**
 * Ids already served recently. Held in `local` and capped, so a refresh can
 * skip past what the viewer has just been looking at.
 */
const readSeenIds = (): Promise<string[]> => {
  return new Promise((resolve) => {
    getLocalChrome([GRID_SEEN_IDS], (options) => {
      resolve(options?.[GRID_SEEN_IDS] || []);
    });
  });
};

const recordSeenIds = (previous: string[], added: string[]) => {
  // Newest first, so the oldest ids fall off the end as the cap bites.
  const merged = [...added, ...previous.filter((id) => !added.includes(id))];
  setLocalChrome({ [GRID_SEEN_IDS]: merged.slice(0, GRID_SEEN_LIMIT) });
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
  const previouslySeen = await readSeenIds();

  const seenIds = new Set<string>([
    ...previouslySeen,
    ...alreadyShown.map((item) => item.nasaId),
  ]);
  const seenTitles = new Set<string>(
    alreadyShown.map((item) => (item.title || '').trim().toLowerCase())
  );

  const untried = shuffle(GRID_QUERIES);
  const merged: TNasaImage[] = [];

  // Subjects vary from 60 to 19,000 results, and the seen-id memory thins
  // them further, so one round can come back with less than a screenful.
  for (
    let round = 0;
    round < GRID_MAX_FETCH_ROUNDS &&
    untried.length &&
    merged.length < GRID_POOL_MIN;
    round++
  ) {
    const queries = untried.splice(0, QUERIES_PER_FETCH);

    // eslint-disable-next-line no-await-in-loop
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

    results.forEach((queryItems) => {
      let taken = 0;
      // Shuffled before capping, so a subject contributes a random slice of
      // its page rather than always the same leading images.
      shuffle(queryItems).forEach((item) => {
        if (taken >= perQueryCap) {
          return;
        }
        // The same asset surfaces under more than one subject, which would
        // tile it twice. The archive also holds the same photograph under
        // several ids at different crops, so the title is deduped too.
        const title = (item.title || '').trim().toLowerCase();
        if (seenIds.has(item.nasaId) || seenTitles.has(title)) {
          return;
        }
        seenIds.add(item.nasaId);
        seenTitles.add(title);
        merged.push(item);
        taken += 1;
      });
    });
  }

  const pool = shuffle(merged).slice(0, GRID_POOL_SIZE);

  // Everything pooled counts as seen, not just what ends up on screen: the
  // pool is cached and resampled across tabs, so the next fetch has to look
  // past all of it to turn up genuinely new pictures.
  if (pool.length) {
    recordSeenIds(
      previouslySeen,
      pool.map((item) => item.nasaId)
    );
  }

  return pool;
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
