import styled from 'styled-components';
import {
  DRAWER_EXPLANATION,
  DRAWER_FAVORITES,
  DRAWER_HISTORY,
} from '../../constants';

const black = '#111111';
export const gray = 'rgba(51,51,51, 0.8)';
export const lightGray = 'rgba(199,199,199, 0.8)';
const highlightBlue = 'rgb(117, 221, 255)';
const explanationTitleWidth = '250px';

const apodButton = `
  background-color: ${gray};
  color: ${lightGray};
  transition: 0.1s linear background-color;

  &.hover,
  &:hover {
    background-color: ${lightGray};
  }
}
`;

const flexCenter = `
  display: flex;
  justify-content: center;
  align-items: center;
`;

const drawerTopOffset = '100px';
const defaultWidth = '400px';
const drawerWidths: { [key: string]: string } = {
  [DRAWER_EXPLANATION]: defaultWidth,
  [DRAWER_FAVORITES]: defaultWidth,
  [DRAWER_HISTORY]: '800px',
  default: defaultWidth,
};

export const SDrawerContainer = styled.div(
  (props: { isOpen: boolean; drawerDisplay: string | null }) => {
    const { isOpen, drawerDisplay } = props;

    const width = drawerDisplay
      ? drawerWidths[drawerDisplay]
      : drawerWidths.default;
    return `
  position: absolute;
  z-index: 1000;
  top: ${drawerTopOffset};
  right: 0;
  max-height: 800px;
  height: calc(100vh - 2 * ${drawerTopOffset});
  width: ${width};
  box-shadow: inset 0 0 0 0.5px ${lightGray};
  background: black;
  color: white;
  align-self: flex-end;
  font-size: 14px;
  transition: 0.4s transform ease-out;

  transform: ${
    isOpen ? 'translate3d(1px, 0px, 0px)' : `translate3d(${width}, 0px, 0px)`
  };
`;
  }
);

export const SDrawerBody = styled.div`
  padding: 8px;
  height: 100%;
  overflow: auto;
`;

export const SDrawerTabContainer = styled.div`
  position: absolute;
  top: 465px;
  left: 0;
  display: flex;
  flex-direction: row-reverse;
  gap: 2px;
  height: 35px;
  width: 500px;
  box-sizing: border-box;
  transform: rotate(-90deg);
  transform-origin: left bottom;
`;

export const SDrawerTab = styled.div`
  ${flexCenter}
  ${apodButton}
  font-size: 12px;
  width: 104px;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SApodContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SMediaContainer = styled.div`
  ${flexCenter}
  background: ${black};

  position: absolute;
  z-index: -1; // put it behind everything else
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

type TApodImage = {
  imageUrl: string;
  backgroundSize?: string;
};
export const SApodImage = styled.div`
  ${flexCenter}
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;

  background-position: center center;
  background-repeat: no-repeat;
  background-image: ${(props: TApodImage) => props.imageUrl};
  background-size: ${(props: TApodImage) => props.backgroundSize};
`;

export const SApodBackgroundImage = styled(SApodImage)`
  opacity: 0.3;
  background-position: 50%;
  background-size: cover;
`;

export const SVideoContainer = styled.div`
  position: absolute;
  ${flexCenter}
  width: 100%;
  height: 100%;
  top: 0;
`;

export const SNavigationButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  opacity: 0.3;
  transition: 0.2s ease-out opacity;
  font-size: 14px;
  color: ${lightGray};

  span a {
    color: ${lightGray};
    text-decoration: none;
    &:hover {
      color: white;
    }
  }

  span {
    cursor: pointer;

    &.current,
    &.favorite {
      color: ${highlightBlue};
      font-weight: 600;
    }
    &.apod-link a {
      color: inherit;
      text-decoration: none;
    }
    &.hover,
    &:hover {
      color: white;
    }
  }
`;

export const SHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  padding-top: 10px;
  width: 100%;
  color: white;
`;

export const STitleImageQuality = styled.span`
  opacity: 0.3;
  align-self: flex-end;
  font-size: 14px;
  color: ${lightGray};
  margin-bottom: 2px;
`;

export const STitleContainer = styled.div`
  position: relative;
  padding: 10px 20px;
  transition: 0.2s linear background-color;
  border-radius: 3px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);

    ${SNavigationButtons},
    ${STitleImageQuality} {
      opacity: 1;
    }
  }
`;

export const STitle = styled.div`
  h1 {
    display: inline-block;
    font-size: 24px;
    font-weight: 300;
  }
  h2 {
    color: ${lightGray};
    font-weight: 300;
  }
`;

export const STitleItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
`;

export const STopSites = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 10px;

  span {
    ${flexCenter}
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

export const SArrowContainer = styled.div`
  cursor: pointer;
  padding: 0 5px;
  height: ${(props: { size: number; isFlipped?: boolean }) => props.size * 2}px;
  transform: ${(props: { size: number; isFlipped?: boolean }) =>
    `rotate(${props.isFlipped ? '180deg' : '0'})`};
`;

export const SHistoryContainer = styled.div`
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px;
`;

export const SHistoryItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  .title {
    width: 100%;
    position: absolute;
    padding: 4px;
    top: 0;

    p {
      background: black;
      padding: 2px;
      margin: 0;
    }
  }

  .media {
    text-align: center;
    overflow: hidden;
    width: 100%;
  }
`;
