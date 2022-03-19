import styled from 'styled-components';

const black = '#111111';
const gray = 'rgba(51,51,51, 0.8)';
const lightGray = 'rgba(199,199,199, 0.8)';
const highlightBlue = 'rgb(117, 221, 255)';
const explanationTitleWidth = '250px';

export const SApodContainer = styled.div``;

export const SMediaContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${black};

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

export const SVideoContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
`;

export const SHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  padding-top: 10px;
  width: 100%;
  color: white;
`;

export const SNavigationButtons = styled.div`
  display: flex;
  gap: 10px;

  span {
    cursor: pointer;
  }
`;

export const STopSites = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 10px;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    a {
      display: inline-block;
      padding: 6px;

      img {
        display: block;
        width: 16px;
        height: 16px;
      }
    }

    &:hover {
      a {
        background: ${lightGray};
      }
    }
  }
`;
