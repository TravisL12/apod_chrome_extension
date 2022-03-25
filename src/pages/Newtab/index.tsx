import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { APOD_OPTIONS, DEFAULT_OPTIONS } from '../../constants';
import { getChrome, onChangeChrome } from '../../utilities';
import { TAppOptions } from '../types';

import ApodBody from './ApodBody';
import './index.css';

const App: React.FC<{ options?: TAppOptions }> = ({ options }) => {
  const [apodOptions, setApodOptions] = useState<TAppOptions>();

  useEffect(() => {
    onChangeChrome((changes) => {
      const updatedSettings = Object.keys(changes).reduce(
        (result: any, setting: any) => {
          result[setting] = changes[setting].newValue;
          return result;
        },
        { ...apodOptions }
      );

      setApodOptions(updatedSettings);
    });

    const syncedOptions = Object.assign({}, DEFAULT_OPTIONS, options);
    setApodOptions(syncedOptions);
  }, []);

  if (!apodOptions) return null; // No options, no rendering

  return <ApodBody options={apodOptions} />;
};

getChrome(APOD_OPTIONS, (options) => {
  render(
    <App options={options} />,
    window.document.querySelector('#app-container')
  );
});

// if (module.hot) module.hot.accept();
