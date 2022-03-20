import React, { useEffect, useState } from 'react';
import { adjacentDate, fetchImage } from '../../utilities';
import { TApodResponse, TFetchOptions } from '../types';
import Header from './Header';
import { SApodContainer, SMediaContainer, SApodImage } from './styles';
import VideoContainer from './VideoContainer';

const ApodBody = () => {
  const [isHighDef, setIsHighDef] = useState<boolean>(false);
  const [apodResponse, setApodReponse] = useState<TApodResponse>();

  const getImage = async (options?: TFetchOptions) => {
    const response = await fetchImage(options);
    console.log(response);
    setApodReponse(response);
  };

  const fetchToday = () => getImage();
  const fetchRandom = () => getImage({ count: 1 });
  const fetchVideoTest = () => getImage({ date: '2012-07-17' });
  const forceHighDef = () => setIsHighDef(true);
  const fetchPreviousDate = () => {
    if (apodResponse?.date) {
      getImage({ date: adjacentDate(apodResponse?.date, -1) });
    }
  };
  const fetchNextDate = () => {
    if (apodResponse?.date) {
      getImage({ date: adjacentDate(apodResponse?.date, 1) });
    }
  };

  useEffect(() => {
    fetchRandom();
  }, []);

  if (!apodResponse) {
    return (
      <SApodContainer>
        <SMediaContainer>
          <h1 style={{ color: 'white' }}>Loading...</h1>
        </SMediaContainer>
      </SApodContainer>
    );
  }

  const navigationButtons = [
    { label: 'Today', clickHandler: fetchToday },
    { label: 'Force HD', clickHandler: forceHighDef },
    { label: 'Previous', clickHandler: fetchPreviousDate },
    { label: 'Next', clickHandler: fetchNextDate },
    { label: 'Save', clickHandler: () => {} }, // handleSaveFavorite,
    { label: 'Random', clickHandler: fetchRandom },
    { label: 'Video Test', clickHandler: fetchVideoTest },
  ];

  return (
    <SApodContainer>
      <Header response={apodResponse} navigationButtons={navigationButtons} />
      <SMediaContainer>
        {apodResponse.media_type === 'video' ? (
          <VideoContainer url={new URL(apodResponse?.url)} />
        ) : (
          <SApodImage
            src={isHighDef ? apodResponse?.hdurl : apodResponse?.url}
          />
        )}
      </SMediaContainer>
    </SApodContainer>
  );
};

export default ApodBody;
