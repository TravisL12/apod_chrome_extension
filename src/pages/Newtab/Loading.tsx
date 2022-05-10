import React from 'react';
import styled from 'styled-components';

// @ts-expect-error
import sunLogo from '../../assets/img/sun_loader.gif';

const SLoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h1 {
    font-size: 80px;
    font-weight: 100;
    background: linear-gradient(
      to bottom,
      #ffffff 0%,
      #a0d7fc 40%,
      #86c7f8 100%
    );
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
  }
`;

const SImageContainer = styled.div`
  width: 125px;
  height: 125px;

  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const Loading: React.FC = () => {
  return (
    <SLoadingContainer>
      <SImageContainer>
        <img src={sunLogo} />
      </SImageContainer>

      <div>
        <h1 style={{ color: 'white' }}>APOD</h1>;
      </div>
    </SLoadingContainer>
  );
};

export default Loading;
