import { useEffect, useMemo, useState } from 'react';
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
import {
  TFetchOptions,
  THistoryItem,
  TNavigationButton,
  TUseNavigationProps,
} from '../pages/types';
import {
  adjacentDate,
  isFirstApodDate,
  saveFavorite,
  setChrome,
  trimDateString,
} from '../utilities';

export const useNavigation = ({
  response,
  options,
  fetchApod,
  loadImage,
  toggleDrawer,
}: TUseNavigationProps) => {
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const fetchResetHistory = (options?: TFetchOptions) => {
    setHistoryIndex(0);
    fetchApod(options);
  };

  const fetchToday = () => fetchResetHistory();
  const fetchRandom = () => fetchResetHistory({ random: true });
  const forceHighDef = () => {
    if (response) {
      loadImage(response, true);
    }
  };
  const fetchPreviousDate = () => {
    if (response?.date && !isFirstApodDate(response?.date)) {
      fetchResetHistory({ date: adjacentDate(response?.date, -1) });
    }
  };
  const fetchNextDate = () => {
    if (response?.date && !!!response?.isToday) {
      fetchResetHistory({ date: adjacentDate(response?.date, 1) });
    }
  };

  const fetchHistory = (direction: number) => {
    const isTooLow = direction < 0 && historyIndex <= 0;
    const isTooHigh =
      direction > 0 && historyIndex === options?.[APOD_HISTORY].length - 1;

    if (isTooLow || isTooHigh) {
      return;
    }

    const historyResponse = options?.[APOD_HISTORY]?.[historyIndex + direction];
    if (historyResponse) {
      fetchApod({ date: historyResponse.date });
      setHistoryIndex(historyIndex + direction);
    }
  };

  const goToApodDate = (date: string) => {
    const findHistoryIndex = options?.[APOD_HISTORY].findIndex(
      (h: THistoryItem) => h.date === date
    );
    if (findHistoryIndex) {
      setHistoryIndex(findHistoryIndex);
    }

    fetchApod({ date });
  };

  useKeyboardShortcut([KEY_MAP.RANDOM_DAY], fetchRandom);
  useKeyboardShortcut([KEY_MAP.TODAY], fetchToday);
  useKeyboardShortcut([KEY_MAP.PREVIOUS_DAY], fetchPreviousDate);
  useKeyboardShortcut([KEY_MAP.NEXT_DAY], fetchNextDate);
  useKeyboardShortcut([KEY_MAP.PREVIOUS_HISTORY], () => fetchHistory(-1));
  useKeyboardShortcut([KEY_MAP.NEXT_HISTORY], () => fetchHistory(1));
  useKeyboardShortcut([KEY_MAP.CLOSE_DRAWER], () => toggleDrawer(null));
  useKeyboardShortcut([KEY_MAP.EXPLANATION_TAB], () =>
    toggleDrawer(DRAWER_EXPLANATION)
  );
  useKeyboardShortcut([KEY_MAP.FAVORITES_TAB], () =>
    toggleDrawer(DRAWER_FAVORITES)
  );
  useKeyboardShortcut([KEY_MAP.HISTORY_TAB], () =>
    toggleDrawer(DRAWER_HISTORY)
  );

  const isFavorite: boolean = useMemo(() => {
    if (!response?.date) {
      return false;
    }

    const favoriteDates = Object.keys(options?.[APOD_FAVORITES]).map(
      (dateKey) => trimDateString(dateKey)
    );

    return favoriteDates.includes(response?.date);
  }, [options, response]);

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
    if (options[HI_RES_ONLY]) {
      forceHighDef();
    }
  }, [options[HI_RES_ONLY]]);

  useEffect(() => {
    let showToday = options[IS_TODAY_APOD];

    if (options[IS_TODAY_LIMIT_ON] && showToday) {
      showToday = options[TODAY_COUNT] < options[TODAY_LIMIT];
      setChrome({ [TODAY_COUNT]: options[TODAY_COUNT] + 1 });
    } else {
      // reset count if `IS_TODAY_LIMIT_ON` is toggled
      setChrome({ [TODAY_COUNT]: 0 });
    }

    showToday ? fetchToday() : fetchRandom();
  }, []);

  return { navigationButtons, goToApodDate };
};
