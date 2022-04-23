import React from 'react';
import { SDrawerBody, SDrawerTab, SDrawerTabContainer } from './styles';
import { TApodResponse, TUseNavigationProps } from '../types';
import { DRAWER_EXPLANATION, DRAWER_FAVORITES } from '../../constants';

type TDrawerProps = {
  drawerDisplay: string | null;
  response?: TApodResponse;
  toggleDrawer: TUseNavigationProps['toggleDrawer'];
};

const Drawer: React.FC<TDrawerProps> = ({
  drawerDisplay,
  response,
  toggleDrawer,
}) => {
  return (
    <SDrawerBody isOpen={!!drawerDisplay}>
      <SDrawerTabContainer>
        <SDrawerTab onClick={() => toggleDrawer(DRAWER_EXPLANATION)}>
          Explanation
        </SDrawerTab>
        <SDrawerTab onClick={() => toggleDrawer(DRAWER_FAVORITES)}>
          Favorites
        </SDrawerTab>
      </SDrawerTabContainer>
      {drawerDisplay === DRAWER_EXPLANATION && response?.explanation}
      {drawerDisplay === DRAWER_FAVORITES && 'Favorites!'}
    </SDrawerBody>
  );
};

export default Drawer;
