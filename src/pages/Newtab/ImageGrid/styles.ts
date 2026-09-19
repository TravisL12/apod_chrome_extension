import styled from 'styled-components';
import { black, gray, highlightBlue, lightBlack, lightGray } from '../styles';

/**
 * The page is a two-row column: a header row sized by its own content, and a
 * body row that takes the remaining height and scrolls inside itself. The
 * header is a sibling of the wall rather than something laid over it, so it
 * never covers a tile and needs no z-index.
 */
export const SGridPage = styled.div`
  font-family: 'Montserrat', sans-serif;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${black};
  color: white;
`;

export const SGridTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 20px 24px 12px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const SGridScroll = styled.div`
  flex: 1;
  /* Without this a flex child refuses to shrink below its content, so the
     body would grow the page instead of scrolling within it. */
  min-height: 0;
  overflow-y: auto;
`;

export const SGridActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  .count {
    color: ${lightGray};
    font-size: 13px;
  }
`;

export const SGridButton = styled.button`
  background: rgba(115, 115, 115, 0.35);
  border: 1px solid ${lightGray};
  border-radius: 3px;
  color: ${lightGray};
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  padding: 6px 14px;

  &:hover:not(:disabled) {
    background: ${gray};
    color: white;
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

export const SMasonry = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px 24px 40px;
`;

export const SMasonryColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  min-width: 0;
`;

export const STile = styled.button`
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 3px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
  font-family: inherit;
  /* The search response carries every asset's dimensions, so the box is
     already the right shape before its thumbnail arrives -- the grid never
     reflows as images land. */
  aspect-ratio: ${(props: { ratio: number }) => props.ratio};
  /* The endless wall reaches a few hundred tiles. Aspect-ratio already fixes
     each box's height, so the browser can skip rendering the ones scrolled
     off screen without the layout collapsing. */
  content-visibility: auto;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease-in;
  }

  img.is-loaded {
    opacity: 1;
  }

  .tile__title {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 8px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
    color: white;
    font-size: 12px;
    line-height: 1.35;
    text-align: left;
    opacity: 0;
    transition: opacity 0.2s ease-in;
  }

  &:hover,
  &:focus-visible {
    border-color: ${highlightBlue};
    outline: none;
  }

  &:hover .tile__title,
  &:focus-visible .tile__title {
    opacity: 1;
  }
`;

export const SGridFooter = styled.div`
  color: ${lightGray};
  font-size: 13px;
  text-align: center;
  padding: 0 24px 32px;
  min-height: 20px;
`;

export const SGridMessage = styled.div`
  color: ${lightGray};
  font-size: 15px;
  padding: 60px 24px;
  text-align: center;
`;

export const SLightbox = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.92);
  padding: 24px;
  gap: 16px;

  .lightbox__close {
    position: absolute;
    top: 16px;
    right: 20px;
  }

  .lightbox__media {
    flex: 1;
    min-height: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
`;

export const SLightboxInfo = styled.div`
  flex-shrink: 0;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  color: ${lightGray};
  font-size: 13px;
  line-height: 1.5;

  h2 {
    color: white;
    font-size: 18px;
    margin: 0 0 6px;
  }

  p {
    margin: 0 0 8px;
    max-height: 90px;
    overflow-y: auto;
  }

  .lightbox__meta {
    display: flex;
    gap: 14px;
    align-items: center;
    flex-wrap: wrap;
  }

  a {
    color: ${highlightBlue};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .lightbox__credit {
    background: ${lightBlack};
    padding: 2px 6px;
    border-radius: 3px;
  }
`;
