import React from 'react';
import { SDrawerBody, SDrawerTab, SDrawerTabContainer } from './styles';
import { TApodResponse } from '../types';

type TDrawerProps = {
  isOpen: boolean;
  response?: TApodResponse;
  toggleExplanation: () => void;
};

const Drawer: React.FC<TDrawerProps> = ({
  isOpen,
  response,
  toggleExplanation,
}) => {
  return (
    <SDrawerBody isOpen={isOpen}>
      <SDrawerTabContainer>
        <SDrawerTab onClick={toggleExplanation}>Explanation</SDrawerTab>
        <SDrawerTab>Favorites</SDrawerTab>
      </SDrawerTabContainer>
      {response?.explanation}
    </SDrawerBody>
  );
};

export default Drawer;
