import React, { useEffect, useState } from 'react';
import { fetchImage } from '../../utilities';
import { SApodContainer, SApodImage } from './styles';

const ApodBody = () => {
  const [imageUrl, setImageUrl] = useState();
  const [videoUrl, setVideoUrl] = useState();

  const getImage = async () => {
    const response = await fetchImage();
    if (response.media_type === 'video') {
      setVideoUrl(response.url); // v3 uses `new URL(reponse.url)` ???
    } else {
      setImageUrl(response.url);
    }
  };

  useEffect(() => {
    getImage();
  }, [fetchImage]);

  return (
    <SApodContainer>
      {imageUrl && <SApodImage src={imageUrl} />}
      {videoUrl && <SApodImage src={videoUrl} />}
    </SApodContainer>
  );
};

export default ApodBody;
