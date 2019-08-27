import React from "react";

export default function ApodDisplay({ loadedImage }) {
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
