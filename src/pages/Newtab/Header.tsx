import React from 'react';
import { TApodResponse } from '../types';
import { SHeader, SNavigationButtons } from './styles';
import TopSites from './TopSites';

type THeaderProps = {
  response: TApodResponse;
  navigationButtons: { label: string; clickHandler: () => void }[];
};

const Header: React.FC<THeaderProps> = ({ response, navigationButtons }) => {
  return (
    <SHeader>
      <div>
        <TopSites />
      </div>
      <div>
        <div>
          <h3>{response.date}</h3>
          <h1>{response.title}</h1>
        </div>
        <SNavigationButtons>
          {navigationButtons.map((button) => {
            return (
              <span key={button.label} onClick={button.clickHandler}>
                {button.label}
              </span>
            );
          })}
        </SNavigationButtons>
      </div>
    </SHeader>
  );
};

export default Header;
