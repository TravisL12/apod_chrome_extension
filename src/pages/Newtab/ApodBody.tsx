import React, { useCallback, useMemo, useState } from 'react';
import {
  APOD_FAVORITES,
  APOD_HISTORY,
  DELAY_FOR_HD_LOAD,
  ERROR_MESSAGE,
  MAX_ERROR_TRIES,
} from '../../constants';
import { useNavigation } from '../../hooks/useNavigation';
import { fetchImage, fetchRandomImage } from '../../utilities';
import { TApodBodyProps, TApodResponse, TFetchOptions } from '../types';
import Drawer from './Drawer';
import Header from './Header';
import ImageContainer from './ImageContainer';
import { SApodContainer, SMediaContainer } from './styles';
import VideoContainer from './VideoContainer';

const ApodBody: React.FC<TApodBodyProps> = ({ options }) => {
  const { hiResOnly, showTopSites } = options;
  const [apodResponse, setApodResponse] = useState<TApodResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasErrorLoading, setHasErrorLoading] = useState<boolean>(false);
  const [drawerDisplay, setDrawerDisplay] = useState<string | null>(null);
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);

  const viewHistory = options?.[APOD_HISTORY];
  const viewFavorites = options?.[APOD_FAVORITES];

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

    setIsLoading(true);

    let response: TApodResponse;

    if (options?.random) {
      response = await fetchRandomImage();
    } else {
      response = await fetchImage(options);
    }

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

  const handleToggleDrawer = (drawerOption: string | null) => {
    const canClose = drawerDisplay === drawerOption && drawerIsOpen;
    if (canClose) {
      setDrawerIsOpen(false);
    } else {
      setDrawerIsOpen(true);
      setDrawerDisplay(drawerOption);
    }
  };

  const { navigationButtons, goToApodDate } = useNavigation({
    response: apodResponse,
    options,
    fetchApod,
    loadImage,
    toggleDrawer: handleToggleDrawer,
  });

  const renderBody = useMemo(() => {
    if (hasErrorLoading) {
      return <h1 style={{ color: 'white' }}>{ERROR_MESSAGE}</h1>;
    }

    if (!apodResponse || isLoading) {
      return <h1 style={{ color: 'white' }}>Loading...</h1>;
    }

    return apodResponse.media_type === 'video' ? (
      <VideoContainer url={new URL(apodResponse?.url)} />
    ) : (
      <ImageContainer loadedImage={apodResponse.loadedImage} />
    );
  }, [hasErrorLoading, apodResponse, isLoading]);

  return (
    <SApodContainer>
      <Header
        isLoading={isLoading}
        response={apodResponse}
        navigationButtons={navigationButtons}
        goToApodDate={goToApodDate}
        showTopSites={showTopSites}
      />
      <SMediaContainer>{renderBody}</SMediaContainer>
      <Drawer
        drawerDisplay={drawerDisplay}
        isOpen={drawerIsOpen}
        response={apodResponse}
        toggleDrawer={handleToggleDrawer}
        viewHistory={viewHistory}
        viewFavorites={viewFavorites}
        goToApodDate={goToApodDate}
      />
    </SApodContainer>
  );
};

export default ApodBody;
