import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { APOD_OPTIONS } from '../../constants';
import { TAppOptions } from '../types';

import ApodBody from './ApodBody';
import './index.css';

const defaultOptions = {
  apodType: 'random',
  apodFavorites: {},
  hiResOnly: false,
  showTopSites: true,
  showHistoryRow: true,
  todayCount: 0,
  todayLimit: 5,
  isTodayLimitOn: false,
};

const App: React.FC<{ options?: TAppOptions }> = ({ options }) => {
  const [apodOptions, setApodOptions] = useState<TAppOptions>();

  useEffect(() => {
    const syncedOptions = Object.assign({}, defaultOptions, options);
    setApodOptions(syncedOptions);
  }, []);

  return <ApodBody {...apodOptions} />;
};

chrome.storage.sync.get(APOD_OPTIONS, (options) => {
  render(
    <App options={options} />,
    window.document.querySelector('#app-container')
  );
});

// if (module.hot) module.hot.accept();
