import React from "react";
import { TitleLoader } from "./LoadingSpinner";

function Image({ loadedImage }) {
  let showFadedBackground = false;
  let backgroundSize = "auto";

  const backgroundImage = `url(${loadedImage.src})`;
  const widthGTwindow = loadedImage.width > window.innerWidth;
  const heightGTwindow = loadedImage.height > window.innerHeight;
  const aspectRatio = loadedImage.width / loadedImage.height;

  if (widthGTwindow || heightGTwindow) {
    showFadedBackground = true;
    backgroundSize = aspectRatio >= 1.3 ? "cover" : "contain";
  }

  if (
    loadedImage.width / window.innerWidth > 0.5 ||
    loadedImage.height / window.innerHeight > 0.5
  ) {
    showFadedBackground = true;
  }

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

export default function ApodDisplay({ response, isLoading, loadedImage }) {
  if (isLoading) {
    return <TitleLoader />;
  }

  const { media_type, url } = response;

  return media_type === "video" ? (
    <Video videoUrl={url} />
  ) : (
    <Image loadedImage={loadedImage} />
  );
}
