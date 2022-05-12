import React from 'react';
import {
  SDrawerContainer,
  SDrawerBody,
  SDrawerTab,
  SDrawerTabContainer,
} from '../styles';
import { TDrawerProps } from '../../types';
import {
  DRAWER_EXPLANATION,
  DRAWER_FAVORITES,
  DRAWER_HISTORY,
} from '../../../constants';
import Explanation from './Tabs/Explanation';
import Favorites from './Tabs/Favorites';
import History from './Tabs/History';
import { titleCase } from '../../../utilities';

const Drawer: React.FC<TDrawerProps> = ({
  drawerDisplay,
  isOpen,
  response,
  viewHistory,
  viewFavorites,
  toggleDrawer,
  goToApodDate,
}) => {
  return (
    <SDrawerContainer drawerDisplay={drawerDisplay} isOpen={isOpen}>
      <SDrawerTabContainer>
        {[DRAWER_EXPLANATION, DRAWER_FAVORITES, DRAWER_HISTORY].map(
          (drawerType) => (
            <SDrawerTab
              key={drawerType}
              isActive={isOpen && drawerDisplay === drawerType}
              onClick={() => toggleDrawer(drawerType)}
            >
              {titleCase(drawerType)}
            </SDrawerTab>
          )
        )}
      </SDrawerTabContainer>
      <SDrawerBody drawerDisplay={drawerDisplay}>
        {drawerDisplay === DRAWER_EXPLANATION && (
          <Explanation response={response} />
        )}
        {drawerDisplay === DRAWER_FAVORITES && (
          <Favorites
            viewFavorites={viewFavorites}
            goToApodDate={goToApodDate}
          />
        )}
        {drawerDisplay === DRAWER_HISTORY && (
          <History viewHistory={viewHistory} goToApodDate={goToApodDate} />
        )}
      </SDrawerBody>
    </SDrawerContainer>
  );
};

export default Drawer;
