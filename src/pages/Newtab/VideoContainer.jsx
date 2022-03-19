import React from 'react';

const VideoContainer = ({ url }) => {
  return (
    <iframe
      title="APOD Video"
      width="960"
      height="540"
      src={url.href}
      frameborder="0"
    ></iframe>
  );
};

export default VideoContainer;
