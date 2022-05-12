import React from 'react';
import { SVideoContainer } from './styles';

const VideoContainer = ({ url }: { url: string }) => {
  const videoUrl = new URL(url);
  return (
    <SVideoContainer>
      <iframe
        title="APOD Video"
        width="960"
        height="540"
        src={videoUrl.href}
        frameBorder="0"
      ></iframe>
    </SVideoContainer>
  );
};

export default VideoContainer;
