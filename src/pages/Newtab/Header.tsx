import React from 'react';
import { prettyDateFormat } from '../../utilities';
import { TApodResponse } from '../types';
import { SHeader, SNavigationButtons, STitleContainer, STitle } from './styles';
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
      <STitleContainer>
        <STitle>
          <h2>{prettyDateFormat(response.date)}</h2>
          <h1>{response.title}</h1>
        </STitle>
        <SNavigationButtons>
          {navigationButtons.map((button) => {
            return (
              <span key={button.label} onClick={button.clickHandler}>
                {button.label}
              </span>
            );
          })}
        </SNavigationButtons>
      </STitleContainer>
    </SHeader>
  );
};

export default Header;
