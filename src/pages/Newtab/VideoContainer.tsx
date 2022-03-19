import React from 'react';

const VideoContainer = ({ url }: { url: any }) => {
  return (
    <iframe
      title="APOD Video"
      width="960"
      height="540"
      src={url.href}
      frameBorder="0"
    ></iframe>
  );
};

export default VideoContainer;
