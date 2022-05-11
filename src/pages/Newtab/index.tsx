import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { APOD_HISTORY, APOD_OPTIONS, DEFAULT_OPTIONS } from '../../constants';
import { getChrome, getLocalChrome, onChangeChrome } from '../../utilities';
import { TAppOptions } from '../types';

import ApodBody from './ApodBody';
import './index.css';
import { FontStyles } from './styles';

const App: React.FC<{ options?: TAppOptions }> = ({ options }) => {
  const [apodOptions, setApodOptions] = useState<TAppOptions>();

  useEffect(() => {
    onChangeChrome((changes) => {
      getChrome(APOD_OPTIONS, (options) => {
        getLocalChrome([APOD_HISTORY], (historyOptions) => {
          const updatedSettings = Object.keys(changes).reduce(
            (result: any, setting: any) => {
              result[setting] = changes[setting].newValue;
              return result;
            },
            { ...options, [APOD_HISTORY]: historyOptions?.[APOD_HISTORY] }
          );
          setApodOptions(updatedSettings);
        });
      });
    });

    const syncedOptions = Object.assign({}, DEFAULT_OPTIONS, options);
    setApodOptions(syncedOptions);
  }, []);

  if (!apodOptions) return null; // No options, no rendering

  return <ApodBody options={apodOptions} />;
};

getChrome(APOD_OPTIONS, (options) => {
  render(
    <>
      <FontStyles />
      <App options={options} />
    </>,

    window.document.querySelector('#app-container')
  );
});
