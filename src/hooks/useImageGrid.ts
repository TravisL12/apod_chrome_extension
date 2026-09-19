import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GRID_BATCH_SIZE, GRID_MAX_TILES } from '../constants';
import { TNasaImage } from '../pages/types';
import {
  fetchImageGrid,
  isGridCacheStale,
  readGridCache,
  shuffle,
  writeGridCache,
} from '../utilities';

/**
 * Holds a pool of tiles and reveals it a batch at a time.
 *
 * A fetch keeps far more tiles than the wall shows, and the pool is reshuffled
 * on every new tab, so each tab opens on a different wall without waiting on
 * the network. Appending then walks further into the same pool, which is why
 * scrolling on stays instant until the pool is spent.
 */
const useImageGrid = () => {
  const [pool, setPool] = useState<TNasaImage[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(GRID_BATCH_SIZE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAppending, setIsAppending] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  // A new tab can be closed mid-request; setting state after that warns.
  const isMounted = useRef<boolean>(true);
  const isFetching = useRef<boolean>(false);
  // Mirror the pool and the reveal position so an append can read both
  // synchronously: it runs from a scroll handler that fires many times in a
  // row, and a `setState` updater would not have applied yet.
  const poolRef = useRef<TNasaImage[]>([]);
  const visibleRef = useRef<number>(GRID_BATCH_SIZE);

  const items = useMemo(
    () => pool.slice(0, visibleCount),
    [pool, visibleCount]
  );

  useEffect(() => {
    poolRef.current = pool;
  }, [pool]);

  useEffect(() => {
    visibleRef.current = visibleCount;
  }, [visibleCount]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadFresh = useCallback(async (showSpinner: boolean) => {
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;

    if (showSpinner) {
      setIsLoading(true);
    }

    try {
      const fresh = await fetchImageGrid();
      if (fresh.length) {
        writeGridCache(fresh);
        if (isMounted.current) {
          visibleRef.current = GRID_BATCH_SIZE;
          setPool(fresh);
          setVisibleCount(GRID_BATCH_SIZE);
          setHasError(false);
        }
      } else if (showSpinner && isMounted.current) {
        // Nothing cached and nothing fetched -- there is no wall to draw.
        setHasError(true);
      }
    } catch (error) {
      console.error('APOD: image grid fetch failed', error);
      if (showSpinner && isMounted.current) {
        setHasError(true);
      }
    } finally {
      isFetching.current = false;
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    readGridCache().then((cache) => {
      if (!isCurrent) return;

      // Paint from cache first so the tab is never blank. Shuffling here is
      // what makes each tab a different wall: without it the cached pool
      // would replay in the same order until the TTL expired.
      if (cache?.items?.length) {
        visibleRef.current = GRID_BATCH_SIZE;
        setPool(shuffle(cache.items));
        setVisibleCount(GRID_BATCH_SIZE);
        setIsLoading(false);
      }

      if (isGridCacheStale(cache)) {
        // With a pool already on screen this only refreshes the cache for the
        // next tab; swapping the wall out from under the viewer mid-scroll
        // would be motion they did not ask for.
        const isFirstPaint = !cache?.items?.length;
        if (isFirstPaint) {
          loadFresh(true);
        } else {
          fetchImageGrid()
            .then((fresh) => fresh.length && writeGridCache(fresh))
            .catch((error) =>
              console.error('APOD: image grid background refill failed', error)
            );
        }
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [loadFresh]);

  const refresh = useCallback(() => loadFresh(true), [loadFresh]);

  /**
   * Reveals the next batch. The pool usually covers it outright; only once it
   * is spent does this go back to the network, excluding what the pool
   * already holds so the wall cannot repeat itself.
   */
  const loadMore = useCallback(async () => {
    const currentPool = poolRef.current;

    if (visibleRef.current < currentPool.length) {
      const next = Math.min(
        visibleRef.current + GRID_BATCH_SIZE,
        currentPool.length
      );
      // Advanced on the ref too, so the next scroll event in the same burst
      // measures against the new position rather than revealing twice.
      visibleRef.current = next;
      setVisibleCount(next);
      return;
    }

    if (isFetching.current) {
      return;
    }

    isFetching.current = true;
    setIsAppending(true);

    try {
      const more = await fetchImageGrid(currentPool);
      if (more.length && isMounted.current) {
        const next = Math.min(
          visibleRef.current + GRID_BATCH_SIZE,
          GRID_MAX_TILES
        );
        visibleRef.current = next;
        setPool((current) => [...current, ...more].slice(0, GRID_MAX_TILES));
        setVisibleCount(next);
      }
    } catch (error) {
      console.error('APOD: image grid append failed', error);
    } finally {
      isFetching.current = false;
      if (isMounted.current) {
        setIsAppending(false);
      }
    }
  }, []);

  const isFull = items.length >= GRID_MAX_TILES;

  return { items, isLoading, isAppending, hasError, refresh, loadMore, isFull };
};

export default useImageGrid;
