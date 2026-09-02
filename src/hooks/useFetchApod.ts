import { useEffect, useRef, useState } from 'react';
import {
  DELAY_FOR_HD_LOAD,
  ERROR_MESSAGE,
  MAX_OTHER_MEDIA_RETRIES,
} from '../constants';
import { TApodResponse, TFetchOptions } from '../pages/types';
import { fetchImage, fetchRandomImage, preloadImage } from '../utilities';

type TFetchApodParams = {
  hiResOnly: boolean | undefined;
  setDrawerIsOpen: (isOpen: boolean) => void;
};

const useFetchApod = ({ hiResOnly, setDrawerIsOpen }: TFetchApodParams) => {
  const [apodResponse, setApodResponse] = useState<TApodResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const hdTimeout = useRef<ReturnType<typeof setTimeout>>();
  const isFetching = useRef<boolean>(false);

  useEffect(() => () => clearTimeout(hdTimeout.current), []);

  // A navigation is only finished once its image has settled, not when the
  // API call returns -- otherwise a second keypress mid-download starts a
  // competing load and whichever image lands last wins.
  const settle = () => {
    isFetching.current = false;
    setIsLoading(false);
  };

  const loadImage = (
    response: TApodResponse,
    forceHighDef: boolean = false
  ) => {
    setIsLoading(true); // when forcing to HD

    // Some entries have no hdurl at all; racing against `undefined` would
    // just fire a doomed request.
    const hasHd = !!response?.hdurl;
    const img = preloadImage(hasHd ? response.hdurl : response.url);
    let isImageHd: boolean = hasHd;

    clearTimeout(hdTimeout.current);
    if (hasHd) {
      hdTimeout.current = setTimeout(() => {
        if (!img.complete && !forceHighDef && !hiResOnly) {
          isImageHd = false;
          img.src = response.url;
        }
      }, DELAY_FOR_HD_LOAD);
    }

    img.onload = () => {
      clearTimeout(hdTimeout.current);
      settle();
      setApodResponse({ ...response, loadedImage: img, isImageHd });
    };

    // Without this a dead hdurl leaves the page spinning forever.
    img.onerror = () => {
      clearTimeout(hdTimeout.current);

      const canFallBack = isImageHd && response.url !== img.src;
      if (canFallBack) {
        isImageHd = false;
        img.src = response.url;
        return;
      }

      settle();
      setApodResponse({
        ...response,
        errorMessage: ERROR_MESSAGE,
      });
    };
  };

  const fetchApod = async (options?: TFetchOptions) => {
    // A ref, not the `isLoading` state: state is stale inside this closure, so
    // the guard was only ever passing by accident.
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;

    setDrawerIsOpen(false);
    setIsLoading(true);

    try {
      let fetchOptions = options;

      // `other` media has nothing to render, so roll to a random APOD --
      // bounded, since a run of them would otherwise recurse forever.
      for (let attempt = 0; attempt <= MAX_OTHER_MEDIA_RETRIES; attempt++) {
        const response: TApodResponse = fetchOptions?.random
          ? await fetchRandomImage()
          : await fetchImage(fetchOptions);

        if (response.error) {
          // A network failure (offline, DNS, timeout) has no `response` at
          // all, so reaching through it threw before the message could show.
          const errMsg = response.error?.response?.data?.msg || ERROR_MESSAGE;
          settle();
          // @ts-expect-error
          setApodResponse({ date: options?.date, errorMessage: errMsg });
          return;
        }

        if (response.media_type === 'other') {
          fetchOptions = { random: true };
          continue;
        }

        if (response.media_type === 'video') {
          settle();
          setApodResponse({ ...response });
          return;
        }

        // `loadImage` owns the guard from here; it clears on load or error.
        loadImage(response);
        return;
      }

      settle();
      // @ts-expect-error
      setApodResponse({ date: options?.date, errorMessage: ERROR_MESSAGE });
    } catch (error) {
      settle();
      console.error('APOD: fetch failed', error);
    }
  };

  return { apodResponse, isLoading, loadImage, fetchApod };
};

export default useFetchApod;
