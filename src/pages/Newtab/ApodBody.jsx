import React, { useEffect, useState } from 'react';
import { fetchImage } from '../../utilities';
import Header from './Header';
import { SApodContainer, SMediaContainer, SApodImage } from './styles';

const ApodBody = () => {
  const [apodResponse, setApodReponse] = useState();

  const getImage = async () => {
    const response = await fetchImage();
    setApodReponse(response);
  };

  useEffect(() => {
    getImage();
  }, [fetchImage]);

  if (!apodResponse) {
    return <SApodContainer>Loading...</SApodContainer>;
  }

  const imageUrl = apodResponse?.url;

  return (
    <SApodContainer>
      <Header response={apodResponse} />
      <SMediaContainer>
        {imageUrl && <SApodImage src={imageUrl} />}
      </SMediaContainer>
    </SApodContainer>
  );
};

export default ApodBody;
