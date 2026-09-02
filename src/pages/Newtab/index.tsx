import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { CURRENT_DATE, DEFAULT_OPTIONS, TODAY_COUNT } from '../../constants';
import {
  formatDate,
  getAllChrome,
  getToday,
  isDateToday,
  onChangeChrome,
  setChrome,
} from '../../utilities';
import { TAppOptions } from '../types';

import ApodBody from './ApodBody';
import './index.css';
import { FontStyles } from './styles';

/**
 * The "show today N times" counter is per-day, so it has to reset when the
 * APOD date rolls over. This runs on first load as well as on every storage
 * change -- running it only on change left the first tab of a new day
 * reading yesterday's count.
 */
const applyDayRollover = (settings: TAppOptions): TAppOptions => {
  if (settings?.[CURRENT_DATE] && isDateToday(settings[CURRENT_DATE])) {
    return settings;
  }

  const today = formatDate(getToday());
  setChrome({ [CURRENT_DATE]: today, [TODAY_COUNT]: 0 });

  return { ...settings, [CURRENT_DATE]: today, [TODAY_COUNT]: 0 };
};

const App: React.FC<{ options?: TAppOptions }> = ({ options }) => {
  const [apodOptions, setApodOptions] = useState<TAppOptions>();

  useEffect(() => {
    onChangeChrome(() => {
      // `getAllChrome` already reflects the write that triggered this, so read
      // the full state rather than patching in `changes` -- a removed key
      // reports `newValue: undefined` and would blank a real setting.
      getAllChrome((allOptions) => {
        setApodOptions(applyDayRollover({ ...DEFAULT_OPTIONS, ...allOptions }));
      });
    });

    setApodOptions(applyDayRollover({ ...DEFAULT_OPTIONS, ...options }));
  }, []);

  if (!apodOptions) return null; // No options, no rendering

  return <ApodBody options={apodOptions} />;
};

getAllChrome((options) => {
  render(
    <>
      <FontStyles />
      <App options={options} />
    </>,

    window.document.querySelector('#app-container')
  );
});
