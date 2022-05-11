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
  STitleItem,
  lightGray,
  SArrowContainer,
} from './styles';
import TopSites from './TopSites';

type THeaderProps = {
  response?: TApodResponse;
  navigationButtons: TNavigationButton[];
  isLoading?: boolean;
  showTopSites?: boolean;
  goToApodDate: (date: string) => void;
};

const ArrowSvg: React.FC<{
  onClick: () => void;
  size: number;
  isFlipped?: boolean;
}> = ({ onClick, size = 15, isFlipped }) => {
  return (
    <SArrowContainer onClick={onClick} size={size} isFlipped={isFlipped}>
      <svg width={size} height={size * 2}>
        <path
          fill={lightGray}
          d={`M0,${size} L${size},${size * 2} L${size},0z`}
        />
      </svg>
    </SArrowContainer>
  );
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
                  isFlipped={true}
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
