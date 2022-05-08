import React from 'react';
import {
  SDrawerContainer,
  SDrawerBody,
  SDrawerTab,
  SDrawerTabContainer,
} from '../styles';
import { TApodResponse, TUseNavigationProps } from '../../types';
import {
  DRAWER_EXPLANATION,
  DRAWER_FAVORITES,
  DRAWER_HISTORY,
} from '../../../constants';
import Explanation from './Tabs/Explanation';
import Favorites from './Tabs/Favorites';
import History from './Tabs/History';

type TDrawerProps = {
  drawerDisplay: string | null;
  isOpen: boolean;
  response?: TApodResponse;
  viewHistory: any;
  toggleDrawer: TUseNavigationProps['toggleDrawer'];
  goToApodDate: (date: string) => void;
};

const Drawer: React.FC<TDrawerProps> = ({
  drawerDisplay,
  isOpen,
  response,
  viewHistory,
  toggleDrawer,
  goToApodDate,
}) => {
  return (
    <SDrawerContainer drawerDisplay={drawerDisplay} isOpen={isOpen}>
      <SDrawerTabContainer>
        <SDrawerTab onClick={() => toggleDrawer(DRAWER_EXPLANATION)}>
          Explanation
        </SDrawerTab>
        <SDrawerTab onClick={() => toggleDrawer(DRAWER_FAVORITES)}>
          Favorites
        </SDrawerTab>
        <SDrawerTab onClick={() => toggleDrawer(DRAWER_HISTORY)}>
          History
        </SDrawerTab>
      </SDrawerTabContainer>
      <SDrawerBody>
        {drawerDisplay === DRAWER_EXPLANATION && (
          <Explanation response={response} />
        )}
        {drawerDisplay === DRAWER_FAVORITES && <Favorites />}
        {drawerDisplay === DRAWER_HISTORY && (
          <History viewHistory={viewHistory} goToApodDate={goToApodDate} />
        )}
      </SDrawerBody>
    </SDrawerContainer>
  );
};

export default Drawer;
