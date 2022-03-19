import styled from 'styled-components';

export const SApodContainer = styled.div`
  height: 100vh;
  width: 100vw;
`;

export const SMediaContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;

  position: absolute;
  z-index: -1; // put it behind everything else
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

export const SApodImage = styled.img`
  max-height: 100%;
  max-width: 100%;
`;

export const SHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: white;
`;
