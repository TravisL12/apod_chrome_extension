import React, { useState } from 'react';
import { DELAY_FOR_HD_LOAD } from '../../constants';
import { useNavigation } from '../../hooks/useNavigation';
import { fetchImage } from '../../utilities';
import { TApodBodyProps, TApodResponse, TFetchOptions } from '../types';
import Header from './Header';
import ImageContainer from './ImageContainer';
import { SApodContainer, SMediaContainer } from './styles';
import VideoContainer from './VideoContainer';

const ApodBody: React.FC<TApodBodyProps> = ({ isHighDef }) => {
  const [apodResponse, setApodReponse] = useState<TApodResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadImage = (
    response: TApodResponse,
    forceHighDef: boolean = false
  ) => {
    const img = new Image();
    img.src = response?.hdurl;

    const timeout = setTimeout(() => {
      if (!img.complete && !forceHighDef && !isHighDef) {
        img.src = response?.url;
      }
    }, DELAY_FOR_HD_LOAD);

    // Preload the image first
    img.onload = () => {
      clearTimeout(timeout);
      setIsLoading(false);
      setApodReponse({ ...response, loadedImage: img });
    };
  };

  const fetchApod = async (options?: TFetchOptions) => {
    setIsLoading(true);
    const response = await fetchImage(options);
    loadImage(response);
  };

  const { navigationButtons } = useNavigation({
    response: apodResponse,
    fetchApod,
    loadImage,
  });

  return (
    <SApodContainer>
      <Header
        isLoading={isLoading}
        response={apodResponse}
        navigationButtons={navigationButtons}
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
    </SApodContainer>
  );
};

export default ApodBody;
