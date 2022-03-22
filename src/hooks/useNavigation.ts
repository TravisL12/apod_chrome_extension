import { useEffect } from 'react';
import useKeyboardShortcut from 'use-keyboard-shortcut';
import { TNavigationButton, TUseNavigationProps } from '../pages/types';
import { adjacentDate, isFirstApodDate } from '../utilities';

const RANDOM_DAY = 'r';
const TODAY = 't';
const PREVIOUS_DAY = 'j';
const NEXT_DAY = 'k';

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

  useKeyboardShortcut([RANDOM_DAY], fetchRandom);
  useKeyboardShortcut([TODAY], fetchToday);
  useKeyboardShortcut([PREVIOUS_DAY], fetchPreviousDate);
  useKeyboardShortcut([NEXT_DAY], fetchNextDate);

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
    {
      label: 'Test video',
      clickHandler: () => fetchApod({ date: '2012-07-17' }),
      isHidden: false,
    },
  ];

  useEffect(() => {
    fetchRandom();
  }, []);

  return { navigationButtons };
};
