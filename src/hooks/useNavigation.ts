import { useEffect } from 'react';
import useKeyboardShortcut from 'use-keyboard-shortcut';
import { TODAY, KEY_MAP } from '../constants';
import { TNavigationButton, TUseNavigationProps } from '../pages/types';
import { adjacentDate, isFirstApodDate } from '../utilities';

// we'll get there
// const EXPLANATION_TAB = 'e';
// const FAVORITES_TAB = 'f';
// const SEARCH_TAB = 's';
// const CLOSE_DRAWER = 'esc';
// const PREVIOUS_HISTORY = 'ArrowLeft';
// const NEXT_HISTORY = 'ArrowRight';

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
    { label: 'Today', clickHandler: fetchToday, isHidden: !!response?.isToday },
    { label: 'Random', clickHandler: fetchRandom, isHidden: false },
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
    { label: 'Save', clickHandler: () => {}, isHidden: false }, // handleSaveFavorite,
    { label: 'Force HD', clickHandler: forceHighDef, isHidden: false },
  ];

  useEffect(() => {
    options.apodType === TODAY ? fetchToday() : fetchRandom();
  }, []);

  return { navigationButtons, goToApodDate };
};
