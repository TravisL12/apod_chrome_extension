import React, { useState } from 'react';
import {
  DELAY_FOR_HD_LOAD,
  ERROR_MESSAGE,
  MAX_ERROR_TRIES,
} from '../../constants';
import { useNavigation } from '../../hooks/useNavigation';
import { fetchImage } from '../../utilities';
import { TApodBodyProps, TApodResponse, TFetchOptions } from '../types';
import Drawer from './Drawer';
import Header from './Header';
import ImageContainer from './ImageContainer';
import { SApodContainer, SMediaContainer } from './styles';
import VideoContainer from './VideoContainer';

const ApodBody: React.FC<TApodBodyProps> = ({ options }) => {
  const { hiResOnly, showTopSites } = options;
  const [apodResponse, setApodResponse] = useState<TApodResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasErrorLoading, setHasErrorLoading] = useState<boolean>(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(false);

  const loadImage = (
    response: TApodResponse,
    forceHighDef: boolean = false
  ) => {
    if (response.media_type === 'other') {
      console.log(response, 'OTHER REPSONSE');
      fetchApod({ count: 1 });
      return;
    }

    const img = new Image();
    if (response.media_type === 'video') {
      setIsLoading(false);
      setApodResponse({ ...response, loadedImage: img });
      return;
    }

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
    setIsLoading(true);
    setIsExplanationOpen(false);
    const response = await fetchImage(options);

    if (response.error) {
      if (errorCount >= MAX_ERROR_TRIES) {
        setIsLoading(false);
        setHasErrorLoading(true);
      } else {
        fetchApod(options, errorCount + 1);
      }
      return;
    }

    loadImage(response);
  };

  const handleOpenExplanation = () => {
    setIsExplanationOpen(!isExplanationOpen);
  };

  const { navigationButtons, goToApodDate } = useNavigation({
    response: apodResponse,
    fetchApod,
    loadImage,
    options,
    toggleExplanation: handleOpenExplanation,
  });

  const renderBody = () => {
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
  };

  return (
    <SApodContainer>
      <Header
        isLoading={isLoading}
        response={apodResponse}
        navigationButtons={navigationButtons}
        goToApodDate={goToApodDate}
        showTopSites={showTopSites}
      />
      <SMediaContainer>{renderBody()}</SMediaContainer>
      <Drawer
        isOpen={isExplanationOpen}
        response={apodResponse}
        toggleExplanation={handleOpenExplanation}
      />
    </SApodContainer>
  );
};

export default ApodBody;
