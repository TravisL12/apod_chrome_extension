import React, { useEffect, useState } from 'react';
import { fetchImage } from '../../utilities';
import Header from './Header';
import { SApodContainer, SMediaContainer, SApodImage } from './styles';

const ApodBody = () => {
  const [apodResponse, setApodReponse] = useState();

  const getImage = async () => {
    const response = await fetchImage();
    console.log(response);
    setApodReponse(response);
  };

  useEffect(() => {
    getImage();
  }, [fetchImage]);

  if (!apodResponse) {
    return <SApodContainer>Loading...</SApodContainer>;
  }

  const mediaUrl = apodResponse?.url;

  return (
    <SApodContainer>
      <Header response={apodResponse} />
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
