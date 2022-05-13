import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { APOD_HISTORY, APOD_OPTIONS, DEFAULT_OPTIONS } from '../../constants';
import { getAllChrome, getLocalChrome, onChangeChrome } from '../../utilities';
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
        setApodOptions(updatedSettings);
      });
    });

    const syncedOptions = Object.assign({}, DEFAULT_OPTIONS, options);
    setApodOptions(syncedOptions);
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
