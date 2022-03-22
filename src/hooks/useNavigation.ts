import { useEffect } from 'react';
import useKeyboardShortcut from 'use-keyboard-shortcut';
import { TApodResponse, TFetchOptions } from '../pages/types';
import { adjacentDate } from '../utilities';

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

type TUseNavigationProps = {
  response?: TApodResponse;
  getImage: (options?: TFetchOptions) => void;
  setIsHighDef: (val: boolean) => void;
};
export const useNavigation = ({
  response,
  getImage,
  setIsHighDef,
}: TUseNavigationProps) => {
  const fetchToday = () => getImage();
  const fetchRandom = () => getImage({ count: 1 });
  const fetchVideoTest = () => getImage({ date: '2012-07-17' });
  const forceHighDef = () => setIsHighDef(true);
  const fetchPreviousDate = () => {
    if (response?.date) {
      getImage({ date: adjacentDate(response?.date, -1) });
    }
  };
  const fetchNextDate = () => {
    if (response?.date) {
      getImage({ date: adjacentDate(response?.date, 1) });
    }
  };

  useKeyboardShortcut([RANDOM_DAY], fetchRandom);
  useKeyboardShortcut([TODAY], fetchToday);
  useKeyboardShortcut([PREVIOUS_DAY], fetchPreviousDate);
  useKeyboardShortcut([NEXT_DAY], fetchNextDate);

  const navigationButtons = [
    { label: 'Today', clickHandler: fetchToday },
    { label: 'Force HD', clickHandler: forceHighDef },
    { label: 'Previous', clickHandler: fetchPreviousDate },
    { label: 'Next', clickHandler: fetchNextDate },
    { label: 'Save', clickHandler: () => {} }, // handleSaveFavorite,
    { label: 'Random', clickHandler: fetchRandom },
    { label: 'Video Test', clickHandler: fetchVideoTest },
  ];

  useEffect(() => {
    fetchRandom();
  }, []);

  return { navigationButtons };
};
