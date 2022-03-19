import React, { useEffect, useState } from 'react';
import { fetchImage } from '../../utilities';
import { TApodResponse } from '../types';
import Header from './Header';
import { SApodContainer, SMediaContainer, SApodImage } from './styles';
import VideoContainer from './VideoContainer';

const ApodBody = () => {
  const [apodResponse, setApodReponse] = useState<TApodResponse>();

  const getImage = async (options?: { count?: number }) => {
    const response = await fetchImage(options);
    console.log(response);
    setApodReponse(response);
  };

  const fetchToday = () => getImage();
  const fetchRandom = () => getImage({ count: 1 });

  useEffect(() => {
    fetchRandom();
  }, [fetchImage]);

  if (!apodResponse) {
    return <SApodContainer>Loading...</SApodContainer>;
  }

  const navigationButtons = [
    { label: 'Today', clickHandler: fetchToday },
    { label: 'Force HD', clickHandler: () => {} }, // handleForceHighDef,
    { label: 'Next', clickHandler: () => {} }, // handleNext,
    { label: 'Previous', clickHandler: () => {} }, // handlePrevious,
    { label: 'Save', clickHandler: () => {} }, // handleSaveFavorite,
    { label: 'Random', clickHandler: fetchRandom },
  ];

  const mediaUrl = apodResponse?.url;
  // 2012-7-17 is video apod need to adjust z-index to click start
  return (
    <SApodContainer>
      <Header response={apodResponse} navigationButtons={navigationButtons} />
      <SMediaContainer>
        {apodResponse.media_type === 'video' ? (
          <VideoContainer url={new URL(mediaUrl)} />
        ) : (
          <SApodImage src={mediaUrl} />
        )}
      </SMediaContainer>
    </SApodContainer>
  );
};

export default ApodBody;
