import React, { useState } from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { fetchImage } from '../../utilities';
import { TApodResponse, TFetchOptions } from '../types';
import Header from './Header';
import ImageContainer from './ImageContainer';
import { SApodContainer, SMediaContainer } from './styles';
import VideoContainer from './VideoContainer';

const ApodBody = () => {
  const [apodResponse, setApodReponse] = useState<TApodResponse>();
  const [isHighDef, setIsHighDef] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getImage = async (options?: TFetchOptions) => {
    setIsLoading(true);
    const response = await fetchImage(options);

    const img = new Image();
    img.src = isHighDef ? response?.hdurl : response?.url;

    // Preload the image first
    img.onload = () => {
      setIsLoading(false);
      setApodReponse({ ...response, loadedImage: img });
    };
  };

  const { navigationButtons } = useNavigation({
    response: apodResponse,
    getImage,
    setIsHighDef,
  });

  if (isLoading || !apodResponse) {
    return (
      <SApodContainer>
        <SMediaContainer>
          <h1 style={{ color: 'white' }}>Loading...</h1>
        </SMediaContainer>
      </SApodContainer>
    );
  }

  return (
    <SApodContainer>
      <Header response={apodResponse} navigationButtons={navigationButtons} />
      <SMediaContainer>
        {apodResponse.media_type === 'video' ? (
          <VideoContainer url={new URL(apodResponse?.url)} />
        ) : (
          <ImageContainer loadedImage={apodResponse.loadedImage} />
        )}
      </SMediaContainer>
    </SApodContainer>
  );
};

export default ApodBody;
