import React, { useState } from 'react';
import { DELAY_FOR_HD_LOAD } from '../../constants';
import { useNavigation } from '../../hooks/useNavigation';
import { fetchImage } from '../../utilities';
import { TApodBodyProps, TApodResponse, TFetchOptions } from '../types';
import Header from './Header';
import ImageContainer from './ImageContainer';
import { SApodContainer, SExplanationBody, SMediaContainer } from './styles';
import VideoContainer from './VideoContainer';

const ApodBody: React.FC<TApodBodyProps> = ({ options }) => {
  const { hiResOnly, showTopSites } = options;
  const [apodResponse, setApodResponse] = useState<TApodResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  const fetchApod = async (options?: TFetchOptions) => {
    setIsLoading(true);
    setIsExplanationOpen(false);
    const response = await fetchImage(options);
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

  return (
    <SApodContainer>
      <Header
        isLoading={isLoading}
        response={apodResponse}
        navigationButtons={navigationButtons}
        goToApodDate={goToApodDate}
        showTopSites={showTopSites}
      />
      <SMediaContainer>
        {!apodResponse || isLoading ? (
          <h1 style={{ color: 'white' }}>Loading...</h1>
        ) : apodResponse.media_type === 'video' ? (
          <VideoContainer url={new URL(apodResponse?.url)} />
        ) : (
          <ImageContainer loadedImage={apodResponse.loadedImage} />
        )}
      </SMediaContainer>
      <SExplanationBody isOpen={isExplanationOpen}>
        {apodResponse?.explanation}
      </SExplanationBody>
    </SApodContainer>
  );
};

export default ApodBody;
