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
  TAppOptions,
} from '../pages/types';
import {
  adjacentDate,
  isFirstApodDate,
  saveFavorite,
  setChrome,
  trimDateString,
} from '../utilities';

const incrementDayCount = (options: TAppOptions) => {
  setChrome({ [TODAY_COUNT]: options[TODAY_COUNT] + 1 });
};

/**
 * The single-letter shortcuts are also ordinary characters, so without this
 * typing "history" into a drawer search box fires the h/t/r handlers.
 */
const whenNotTyping = (handler: () => void) => () => {
  const el = document.activeElement as HTMLElement | null;
  const isTyping =
    !!el &&
    (el.tagName === 'INPUT' ||
      el.tagName === 'TEXTAREA' ||
      el.tagName === 'SELECT' ||
      el.isContentEditable);

  if (!isTyping) {
    handler();
  }
};

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
    // `findIndex` returns -1 on a miss (truthy) and 0 for the newest entry
    // (falsy), so a bare truthiness check got both cases backwards.
    if (findHistoryIndex > -1) {
      setHistoryIndex(findHistoryIndex);
    }

    fetchApod({ date });
  };

  useKeyboardShortcut([KEY_MAP.RANDOM_DAY], whenNotTyping(fetchRandom));
  useKeyboardShortcut([KEY_MAP.TODAY], whenNotTyping(fetchToday));
  useKeyboardShortcut([KEY_MAP.PREVIOUS_DAY], whenNotTyping(fetchPreviousDate));
  useKeyboardShortcut([KEY_MAP.NEXT_DAY], whenNotTyping(fetchNextDate));
  useKeyboardShortcut(
    [KEY_MAP.PREVIOUS_HISTORY],
    whenNotTyping(() => fetchHistory(-1))
  );
  useKeyboardShortcut(
    [KEY_MAP.NEXT_HISTORY],
    whenNotTyping(() => fetchHistory(1))
  );
  useKeyboardShortcut([KEY_MAP.CLOSE_DRAWER], () => toggleDrawer(null));
  useKeyboardShortcut(
    [KEY_MAP.EXPLANATION_TAB],
    whenNotTyping(() => toggleDrawer(DRAWER_EXPLANATION))
  );
  useKeyboardShortcut(
    [KEY_MAP.FAVORITES_TAB],
    whenNotTyping(() => toggleDrawer(DRAWER_FAVORITES))
  );
  useKeyboardShortcut(
    [KEY_MAP.HISTORY_TAB],
    whenNotTyping(() => toggleDrawer(DRAWER_HISTORY))
  );

  const isFavorite: boolean = useMemo(() => {
    if (!response?.date) {
      return false;
    }

    const favoriteDates = Object.keys(options?.[APOD_FAVORITES] || {}).map(
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
      incrementDayCount(options);
    }

    showToday ? fetchToday() : fetchRandom();
  }, []);

  return { navigationButtons, goToApodDate };
};
