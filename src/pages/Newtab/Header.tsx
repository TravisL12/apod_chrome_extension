import React from 'react';
import { prettyDateFormat } from '../../utilities';
import { TApodResponse, TNavigationButton } from '../types';
import CalendarPicker from './CalendarPicker/Calendar';
import { SHeader, SNavigationButtons, STitleContainer, STitle } from './styles';
import TopSites from './TopSites';

type THeaderProps = {
  response?: TApodResponse;
  navigationButtons: TNavigationButton[];
  isLoading?: boolean;
  goToApodDate: (date: string) => void;
};

const Header: React.FC<THeaderProps> = ({
  response,
  navigationButtons,
  isLoading,
  goToApodDate,
}) => {
  return (
    <SHeader>
      <div>
        <TopSites />
      </div>
      {response && !isLoading && (
        <STitleContainer>
          <STitle>
            <CalendarPicker startDate={response.date} onChange={goToApodDate}>
              <h2>{prettyDateFormat(response.date)}</h2>
            </CalendarPicker>
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
      )}
    </SHeader>
  );
};

export default Header;
