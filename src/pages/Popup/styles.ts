import styled from 'styled-components';

export const SPopupContainer = styled.div`
  width: 300px;
  padding: 10px;
  background: lightgray;
`;

export const SOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

export const SOption = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 4px;
  background: white;

  label {
    font-weight: 700;
  }

  .sub-info {
    margin-top: 4px;
    color: #444;
  }

  input[type='number'] {
    width: 50px;
    text-align: right;
  }
`;

export const SAboutApod = styled.div``;

export const SAboutLinks = styled.div`
  display: flex;
  justify-content: space-between;
`;
