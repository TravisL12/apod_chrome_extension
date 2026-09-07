import styled from 'styled-components';

const bg = '#e6e8eb';
const panel = '#ffffff';
const border = '#d5d9df';
const text = '#1f2328';
const subText = '#5b6470';
const accent = '#1a73e8';

export const SPopupContainer = styled.div`
  width: 340px;
  padding: 16px;
  background: ${bg};
  color: ${text};
  font-size: 13px;
`;

export const SHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;

  img {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
  }

  h1 {
    margin: 0;
    font-size: 16px;
    line-height: 1.2;
    letter-spacing: 0.2px;
  }

  .subtitle {
    margin-top: 2px;
    color: ${subText};
    font-size: 11px;
    letter-spacing: 0.5px;
  }
`;

export const SOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

export const SOption = styled.div`
  border: 1px solid ${border};
  border-radius: 2px;
  background: ${panel};

  .main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 12px;
    cursor: pointer;
  }

  .title {
    font-weight: 600;
    line-height: 1.3;
  }

  .sub-info {
    margin-top: 4px;
    color: ${subText};
    line-height: 1.4;
  }
`;

/* A pill switch built on top of the real checkbox so it stays accessible. */
export const SToggle = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 36px;
  height: 20px;
  margin-top: 1px;
  border-radius: 10px;
  background: #c3c8d0;
  transition: background 0.15s ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    transition: transform 0.15s ease;
  }

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &:has(input:checked) {
    background: ${accent};
  }

  &:has(input:checked)::after {
    transform: translateX(16px);
  }

  &:has(input:focus-visible) {
    outline: 2px solid ${accent};
    outline-offset: 2px;
  }
`;

export const SLimitRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 0 12px;
  padding: 10px 0;
  border-top: 1px solid ${border};

  label {
    color: ${subText};
    line-height: 1.4;
  }

  input[type='number'] {
    width: 56px;
    padding: 5px 6px;
    border: 1px solid ${border};
    border-radius: 6px;
    background: ${panel};
    color: ${text};
    font-size: 13px;
    text-align: right;
  }

  input[type='number']:focus-visible {
    outline: 2px solid ${accent};
    outline-offset: 1px;
  }
`;

export const SAboutApod = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid ${border};
  color: ${subText};
  font-size: 11px;
  white-space: nowrap;
`;

export const SAboutLinks = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  gap: 10px;

  a {
    color: ${accent};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;
