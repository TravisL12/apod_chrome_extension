import { useState } from 'react';
import { DELAY_FOR_HD_LOAD, MAX_ERROR_TRIES } from '../constants';
import { TApodResponse, TFetchOptions } from '../pages/types';
import { fetchImage, fetchRandomImage } from '../utilities';

type TFetchApodParams = {
  hiResOnly: boolean | undefined;
  setDrawerIsOpen: (isOpen: boolean) => void;
};

const useFetchApod = ({ hiResOnly, setDrawerIsOpen }: TFetchApodParams) => {
  const [apodResponse, setApodResponse] = useState<TApodResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasErrorLoading, setHasErrorLoading] = useState<boolean>(false);

  const loadImage = (
    response: TApodResponse,
    forceHighDef: boolean = false
  ) => {
    const img = new Image();
    let isImageHd: boolean = true;
    img.src = response?.hdurl;

    const timeout = setTimeout(() => {
      if (!img.complete && !forceHighDef && !hiResOnly) {
        isImageHd = false;
        img.src = response?.url;
      }
    }, DELAY_FOR_HD_LOAD);

    img.onload = () => {
      clearTimeout(timeout);
      setIsLoading(false);
      setApodResponse({ ...response, loadedImage: img, isImageHd });
    };
  };

  const fetchApod = async (options?: TFetchOptions, errorCount: number = 0) => {
    if (isLoading) {
      return;
    }

    setDrawerIsOpen(false);
    setIsLoading(true);

    const response: TApodResponse = options?.random
      ? await fetchRandomImage()
      : await fetchImage(options);

    if (response.error) {
      if (errorCount >= MAX_ERROR_TRIES) {
        setIsLoading(false);
        setHasErrorLoading(true);
      } else {
        fetchApod(options, errorCount + 1);
      }
      return;
    }

    if (response.media_type === 'other') {
      console.log(response, 'OTHER REPSONSE');
      fetchApod({ random: true });
      return;
    }

    if (response.media_type === 'video') {
      setIsLoading(false);
      setApodResponse({ ...response });
      return;
    }

    loadImage(response);
  };

  return { apodResponse, isLoading, hasErrorLoading, loadImage, fetchApod };
};

export default useFetchApod;
