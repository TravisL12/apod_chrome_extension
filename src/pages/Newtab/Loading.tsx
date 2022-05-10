import React from 'react';

// @ts-expect-error
import sunLogo from '../../assets/img/sun_loader.gif';

const Loading: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <img src={sunLogo} />
      <h1 style={{ color: 'white' }}>Loading...</h1>;
    </div>
  );
};

export default Loading;
