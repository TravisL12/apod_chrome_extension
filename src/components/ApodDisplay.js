import React from "react";
import { getImageDimensions } from "../utilities";

function Image({ loadedImage }) {
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
}

function Video({ videoUrl }) {
  const url = new URL(videoUrl);
  url.search = "autopause=1&autoplay=0";

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
}

export default function ApodDisplay({ response, loadedImage }) {
  if (loadedImage) {
    return <Image loadedImage={loadedImage} />;
  } else if (response && response.media_type === "video") {
    return <Video videoUrl={response.url} />;
  }

  return null;
}
