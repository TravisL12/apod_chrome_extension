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

const App: React.FC<{ options?: TAppOptions }> = ({ options }) => {
  const [apodOptions, setApodOptions] = useState<TAppOptions>();

  useEffect(() => {
    onChangeChrome((changes) => {
      getAllChrome((allOptions) => {
        const updatedSettings = Object.keys(changes).reduce(
          (result: any, setting: any) => {
            result[setting] = changes[setting].newValue;
            return result;
          },
          { ...allOptions }
        );

        if (
          !updatedSettings?.[CURRENT_DATE] ||
          !isDateToday(updatedSettings?.[CURRENT_DATE])
        ) {
          const today = formatDate(getToday());
          updatedSettings[CURRENT_DATE] = today;
          updatedSettings[TODAY_COUNT] = 0;

          setChrome({ [CURRENT_DATE]: today, [TODAY_COUNT]: 0 });
        }

        setApodOptions({ ...DEFAULT_OPTIONS, ...updatedSettings });
      });
    });

    setApodOptions({ ...DEFAULT_OPTIONS, ...options });
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
