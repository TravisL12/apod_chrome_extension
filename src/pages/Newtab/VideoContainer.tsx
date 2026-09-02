import React from 'react';
import { ERROR_MESSAGE } from '../../constants';
import { SVideoContainer } from './styles';

const VideoContainer = ({ url }: { url: string }) => {
  // `new URL` throws on a malformed value, and with no error boundary above
  // this that took the whole new tab down.
  let videoUrl: URL;
  try {
    videoUrl = new URL(url);
  } catch (error) {
    return <h1 style={{ color: 'white' }}>{ERROR_MESSAGE}</h1>;
  }

  return (
    <SVideoContainer>
      <iframe
        title="APOD Video"
        width="960"
        height="540"
        src={videoUrl.href}
        frameBorder="0"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </SVideoContainer>
  );
};

export default VideoContainer;
