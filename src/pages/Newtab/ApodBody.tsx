import React, { useState } from 'react';
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
    img.src = isHighDef || forceHighDef ? response?.hdurl : response?.url;

    // Preload the image first
    img.onload = () => {
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
