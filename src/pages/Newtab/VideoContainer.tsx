import React from 'react';
import { SVideoContainer } from './styles';

const VideoContainer = ({ url }: { url: any }) => {
  return (
    <SVideoContainer>
      <iframe
        title="APOD Video"
        width="960"
        height="540"
        src={url.href}
        frameBorder="0"
      ></iframe>
    </SVideoContainer>
  );
};

export default VideoContainer;
