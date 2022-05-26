import React, { useState } from 'react';
import { MIN_APOD_DATE } from '../../constants';
import { prettyDateFormat } from '../../utilities';
import { TApodResponse, TNavigationButton } from '../types';
import { ArrowSvg } from './ArrowSvg';
import CalendarPicker from './CalendarPicker';
import {
  SHeader,
  SNavigationButtons,
  STitleContainer,
  STitle,
  STitleImageQuality,
  STitleItem,
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
  const prevNav = navigationButtons[0];
  const nextNav = navigationButtons[1];
  return (
    <SHeader>
      <div>{showTopSites && <TopSites />}</div>
      {response && !isLoading && (
        <STitleContainer>
          <STitle>
            <STitleItem>
              {!prevNav.isHidden && (
                <ArrowSvg size={7} onClick={prevNav.clickHandler} />
              )}
              <CalendarPicker
                startDate={new Date(response.date)}
                onChange={goToApodDate}
                isOpen={isCalendarOpen}
                setIsOpen={setIsCalendarOpen}
                minDate={MIN_APOD_DATE}
                maxDate={new Date()}
              >
                <h2
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  style={{ cursor: 'pointer' }}
                >
                  {prettyDateFormat(response.date)}
                </h2>
              </CalendarPicker>
              {!nextNav.isHidden && (
                <ArrowSvg
                  pointRight={true}
                  size={7}
                  onClick={nextNav.clickHandler}
                />
              )}
            </STitleItem>
            <STitleItem>
              <h1>{response.title}</h1>
              {response.isImageHd && (
                <STitleImageQuality>HD</STitleImageQuality>
              )}
            </STitleItem>
          </STitle>
          <SNavigationButtons>
            {navigationButtons.slice(2).map((navItem) => {
              return (
                !navItem.isHidden && (
                  <span key={navItem.label} onClick={navItem.clickHandler}>
                    {navItem.isFavorite ? (
                      <strong style={{ color: 'lightblue' }}>Favorite!</strong>
                    ) : (
                      navItem.label
                    )}
                  </span>
                )
              );
            })}
            <span>
              <a
                href={`https://www.redundantrobot.com/apod?date=${response.date}`}
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
