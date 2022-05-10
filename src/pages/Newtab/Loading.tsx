import React from 'react';
import icon from '../../assets/img/sun_loader.webp';

const Loading: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <img src={icon} />
      <h1 style={{ color: 'white' }}>Loading...</h1>;
    </div>
  );
};

export default Loading;
