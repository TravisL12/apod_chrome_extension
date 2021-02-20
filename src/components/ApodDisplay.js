import React, { memo } from 'react';
import { getImageDimensions } from '../utilities';

const Image = memo(({ loadedImage }) => {
  const backgroundImage = `url(${loadedImage.src})`;
  const { showFadedBackground, backgroundSize } = getImageDimensions(
    loadedImage
  );

  return (
    <div className="apod-body">
      {showFadedBackground && (
        <div class="apod__background-image" style={{ backgroundImage }} />
      )}
      <div
        className="apod__image"
        style={{ backgroundImage, backgroundSize }}
      />
    </div>
  );
});

const Video = memo(({ url }) => {
  return (
    <div className="apod-body">
      <div className="apod__image">
        <iframe
          title="APOD Video"
          width="960"
          height="540"
          src={url.href}
          frameborder="0"
        ></iframe>
      </div>
    </div>
  );
});

function ApodDisplay({ videoUrl, loadedImage }) {
  if (loadedImage) {
    return <Image loadedImage={loadedImage} />;
  } else if (videoUrl) {
    return <Video url={videoUrl} />;
  }

  return null;
}

export default memo(ApodDisplay);
