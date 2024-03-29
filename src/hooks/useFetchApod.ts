import { useState } from 'react';
import { DELAY_FOR_HD_LOAD, ERROR_MESSAGE } from '../constants';
import { TApodResponse, TFetchOptions } from '../pages/types';
import { fetchImage, fetchRandomImage, preloadImage } from '../utilities';

type TFetchApodParams = {
  hiResOnly: boolean | undefined;
  setDrawerIsOpen: (isOpen: boolean) => void;
};

const useFetchApod = ({ hiResOnly, setDrawerIsOpen }: TFetchApodParams) => {
  const [apodResponse, setApodResponse] = useState<TApodResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<boolean>(false);

  const loadImage = (
    response: TApodResponse,
    forceHighDef: boolean = false
  ) => {
    setIsLoading(true); // when forcing to HD
    const img = preloadImage(response?.hdurl);
    let isImageHd: boolean = true;

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

  const fetchApod = async (options?: TFetchOptions) => {
    if (isLoading) {
      return;
    }

    setDrawerIsOpen(false);
    setIsLoading(true);

    const response: TApodResponse = options?.random
      ? await fetchRandomImage()
      : await fetchImage(options);

    if (response.error) {
      const errMsg = response.error.response.data.msg || ERROR_MESSAGE;
      setIsLoading(false);
      // @ts-expect-error
      setApodResponse({ date: options?.date, errorMessage: errMsg });
      return;
    }
    setErrorMessage(false);

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

  return { apodResponse, isLoading, errorMessage, loadImage, fetchApod };
};

export default useFetchApod;
