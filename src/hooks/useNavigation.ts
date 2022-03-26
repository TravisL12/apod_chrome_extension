import { useEffect } from 'react';
import useKeyboardShortcut from 'use-keyboard-shortcut';
import { TODAY, KEY_MAP, IS_TODAY_APOD, HI_RES_ONLY } from '../constants';
import { TNavigationButton, TUseNavigationProps } from '../pages/types';
import { adjacentDate, isFirstApodDate } from '../utilities';

export const useNavigation = ({
  response,
  fetchApod,
  loadImage,
  options,
}: TUseNavigationProps) => {
  const fetchToday = () => fetchApod();
  const fetchRandom = () => fetchApod({ count: 1 });
  const forceHighDef = () => {
    if (response) loadImage(response, true);
  };
  const fetchPreviousDate = () => {
    if (response?.date) {
      fetchApod({ date: adjacentDate(response?.date, -1) });
    }
  };
  const fetchNextDate = () => {
    if (response?.date) {
      fetchApod({ date: adjacentDate(response?.date, 1) });
    }
  };

  const goToApodDate = (date: string) => {
    fetchApod({ date });
  };

  useKeyboardShortcut([KEY_MAP.RANDOM_DAY], fetchRandom);
  useKeyboardShortcut([KEY_MAP.TODAY], fetchToday);
  useKeyboardShortcut([KEY_MAP.PREVIOUS_DAY], fetchPreviousDate);
  useKeyboardShortcut([KEY_MAP.NEXT_DAY], fetchNextDate);

  const navigationButtons: TNavigationButton[] = [
    {
      label: 'Previous',
      clickHandler: fetchPreviousDate,
      isHidden: isFirstApodDate(response?.date),
    },
    {
      label: 'Next',
      clickHandler: fetchNextDate,
      isHidden: !!response?.isToday,
    },
    { label: 'Today', clickHandler: fetchToday, isHidden: !!response?.isToday },
    { label: 'Random', clickHandler: fetchRandom, isHidden: false },
    { label: 'Save', clickHandler: () => {}, isHidden: false }, // handleSaveFavorite,
    {
      label: 'Force HD',
      clickHandler: forceHighDef,
      isHidden: !!options?.[HI_RES_ONLY] || !!response?.isImageHd,
    },
  ];

  useEffect(() => {
    if (options[HI_RES_ONLY]) {
      forceHighDef();
    }
  }, [options[HI_RES_ONLY]]);

  useEffect(() => {
    options[IS_TODAY_APOD] ? fetchToday() : fetchRandom();
  }, []);

  return { navigationButtons, goToApodDate };
};
