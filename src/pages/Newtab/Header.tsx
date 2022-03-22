import React from 'react';
import { prettyDateFormat } from '../../utilities';
import { TApodResponse, TNavigationButton } from '../types';
import { SHeader, SNavigationButtons, STitleContainer, STitle } from './styles';
import TopSites from './TopSites';

type THeaderProps = {
  response: TApodResponse;
  navigationButtons: TNavigationButton[];
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
          {navigationButtons.map((navItem) => {
            return (
              !navItem.isHidden && (
                <span key={navItem.label} onClick={navItem.clickHandler}>
                  {navItem.label}
                </span>
              )
            );
          })}
          <span>
            <a
              href={response.apodUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              APOD
            </a>
          </span>
        </SNavigationButtons>
      </STitleContainer>
    </SHeader>
  );
};

export default Header;
