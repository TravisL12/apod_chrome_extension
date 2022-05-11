import React from 'react';
import styled from 'styled-components';

// @ts-expect-error
import sunLogo from '../../assets/img/sun_loader.gif';
import Fader from './Fader';

const SLoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  h1,
  h2 {
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
  width: 80px;
  height: 80px;

  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const Loading: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return (
    <Fader isVisible={isLoading}>
      <SLoadingContainer>
        <SImageContainer>
          <img src={sunLogo} />
        </SImageContainer>

        <div>
          <h1 style={{ fontWeight: 400, fontSize: '60px' }}>APOD</h1>
        </div>
      </SLoadingContainer>
    </Fader>
  );
};

export default Loading;
