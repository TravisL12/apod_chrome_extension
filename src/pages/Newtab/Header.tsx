import React, { useState } from 'react';
import { prettyDateFormat } from '../../utilities';
import { TApodResponse, TNavigationButton } from '../types';
import CalendarPicker from './CalendarPicker';
import {
  SHeader,
  SNavigationButtons,
  STitleContainer,
  STitle,
  STitleImageQuality,
} from './styles';
import TopSites from './TopSites';

type THeaderProps = {
  response?: TApodResponse;
  navigationButtons: TNavigationButton[];
  isLoading?: boolean;
  showTopSites?: boolean;
  goToApodDate: (date: string) => void;
};

const Header: React.FC<THeaderProps> = ({
  response,
  navigationButtons,
  isLoading,
  showTopSites,
  goToApodDate,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  return (
    <SHeader>
      <div>{showTopSites && <TopSites />}</div>
      {response && !isLoading && (
        <STitleContainer>
          <STitle>
            <CalendarPicker
              startDate={new Date(response.date)}
              onChange={goToApodDate}
              isOpen={isCalendarOpen}
              setIsOpen={setIsCalendarOpen}
            >
              <h2 onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                {prettyDateFormat(response.date)}
              </h2>
            </CalendarPicker>
            <h1>{response.title}</h1>
            {response.isImageHd && <STitleImageQuality>HD</STitleImageQuality>}
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
