import { useEffect, useState } from 'react';
import useKeyboardShortcut from 'use-keyboard-shortcut';
import {
  KEY_MAP,
  IS_TODAY_APOD,
  HI_RES_ONLY,
  DRAWER_EXPLANATION,
  DRAWER_FAVORITES,
  IS_TODAY_LIMIT_ON,
  TODAY_COUNT,
  TODAY_LIMIT,
  DRAWER_HISTORY,
  APOD_FAVORITES,
  APOD_HISTORY,
} from '../constants';
import { TNavigationButton, TUseNavigationProps } from '../pages/types';
import {
  adjacentDate,
  isFirstApodDate,
  saveFavorite,
  setChrome,
} from '../utilities';

export const useNavigation = ({
  response,
  options = {},
  fetchApod,
  loadImage,
  toggleDrawer,
}: TUseNavigationProps) => {
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const fetchToday = () => fetchApod();
  const fetchRandom = () => fetchApod({ random: true });
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

  const fetchPreviousHistory = () => {
    if (historyIndex <= 0) {
      return;
    }
    setHistoryIndex(historyIndex - 1);
  };
  const fetchNextHistory = () => {
    if (historyIndex === options?.[APOD_HISTORY].length - 1) {
      return;
    }
    setHistoryIndex(historyIndex + 1);
  };

  const goToApodDate = (date: string) => {
    fetchApod({ date });
  };

  useKeyboardShortcut([KEY_MAP.RANDOM_DAY], fetchRandom);
  useKeyboardShortcut([KEY_MAP.TODAY], fetchToday);
  useKeyboardShortcut([KEY_MAP.PREVIOUS_DAY], fetchPreviousDate);
  useKeyboardShortcut([KEY_MAP.NEXT_DAY], fetchNextDate);
  useKeyboardShortcut([KEY_MAP.PREVIOUS_HISTORY], fetchPreviousHistory);
  useKeyboardShortcut([KEY_MAP.NEXT_HISTORY], fetchNextHistory);
  useKeyboardShortcut([KEY_MAP.EXPLANATION_TAB], () =>
    toggleDrawer(DRAWER_EXPLANATION)
  );
  useKeyboardShortcut([KEY_MAP.FAVORITES_TAB], () =>
    toggleDrawer(DRAWER_FAVORITES)
  );
  useKeyboardShortcut([KEY_MAP.HISTORY_TAB], () =>
    toggleDrawer(DRAWER_HISTORY)
  );
  useKeyboardShortcut([KEY_MAP.CLOSE_DRAWER], () => toggleDrawer(null));

  const isFavorite: boolean = response?.date
    ? !!options?.[APOD_FAVORITES]?.[response?.date]
    : false;
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
    {
      label: 'Save',
      clickHandler: () => saveFavorite(response),
      isHidden: false,
      isFavorite,
    },
    {
      label: 'Force HD',
      clickHandler: forceHighDef,
      isHidden:
        !!options?.[HI_RES_ONLY] ||
        !!response?.isImageHd ||
        response?.media_type !== 'image',
    },
  ];

  useEffect(() => {
    const historyResponse = options?.[APOD_HISTORY]?.[historyIndex];
    if (historyResponse) {
      fetchApod({ date: historyResponse.date });
    }
  }, [historyIndex]);

  useEffect(() => {
    if (options[HI_RES_ONLY]) {
      forceHighDef();
    }
  }, [options[HI_RES_ONLY]]);

  useEffect(() => {
    let showToday = options[IS_TODAY_APOD];

    if (options[IS_TODAY_LIMIT_ON] && showToday) {
      // @ts-expect-error
      showToday = options[TODAY_COUNT] < options[TODAY_LIMIT];
      // @ts-expect-error
      setChrome({ [TODAY_COUNT]: options[TODAY_COUNT] + 1 });
    } else {
      // reset count if `IS_TODAY_LIMIT_ON` is toggled
      setChrome({ [TODAY_COUNT]: 0 });
    }

    showToday ? fetchToday() : fetchRandom();
  }, []);

  return { navigationButtons, goToApodDate };
};
