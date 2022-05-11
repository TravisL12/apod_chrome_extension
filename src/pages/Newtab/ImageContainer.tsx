import React from 'react';
import { getImageDimensions } from '../../utilities';
import { SApodBackgroundImage, SApodImage } from './styles';

const ImageContainer = ({ loadedImage }: { loadedImage: HTMLImageElement }) => {
  const backgroundImage = `url(${loadedImage.src})`;
  const { showFadedBackground, backgroundSize } =
    getImageDimensions(loadedImage);

  return (
    <>
      {showFadedBackground && (
        <SApodBackgroundImage imageUrl={backgroundImage} />
      )}
      <SApodImage
        imageUrl={backgroundImage}
        backgroundSize={backgroundSize}
      ></SApodImage>
    </>
  );
};

export default ImageContainer;
