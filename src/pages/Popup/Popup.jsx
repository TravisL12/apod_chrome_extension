import React, { useState, useEffect } from 'react';
import './index.css';
import {
  IS_TODAY_APOD,
  HI_RES_ONLY,
  SHOW_TOP_SITES,
  IS_TODAY_LIMIT_ON,
  DEFAULT_OPTIONS,
  APOD_OPTIONS,
  TODAY_LIMIT_COUNT,
  TODAY_LIMIT,
} from '../../constants';
import { getChrome, setChrome } from '../../utilities';
import {
  SOption,
  SPopupContainer,
  SOptionsContainer,
  SAboutApod,
  SAboutLinks,
} from './styles';

const manifest = chrome.runtime.getManifest();

const optionsConfig = [
  {
    id: IS_TODAY_APOD,
    label: "Show Today's APOD",
    description: `Will load the current APOD, otherwise will show a random APOD.`,
    type: 'checkbox',
  },
  {
    id: HI_RES_ONLY,
    label: 'High Resolution Images Only',
    description: `When turned off, the standard image loads if the HD image takes too long.`,
    type: 'checkbox',
  },
  {
    id: SHOW_TOP_SITES,
    label: 'Show Top Sites',
    description: `This will show/hide the Top Site icons.`,
    type: 'checkbox',
  },
  {
    id: IS_TODAY_LIMIT_ON,
    label: 'Switch from Today to Random',
    description: `Show today's APOD multiple times and then will switch to random APOD's.
    Use the input below to set the limit.`,
    type: 'checkbox',
  },
];

const Popup = () => {
  const [popupOptions, setPopupOptions] = useState();

  useEffect(() => {
    getChrome(APOD_OPTIONS, (options) => {
      setPopupOptions({ ...DEFAULT_OPTIONS, ...options });
    });
  }, []);

  const handleCheckboxChange = (event) => {
    const key = [event.target.id];
    const value = event.target.checked;
    setChrome({ [key]: value }, () => {
      setPopupOptions({
        ...popupOptions,
        [key]: value,
      });
    });
  };

  if (!popupOptions) {
    return null;
  }
  return (
    <SPopupContainer>
      <h3>Options</h3>
      <SOptionsContainer>
        {optionsConfig.map((option) => (
          <SOption key={option.id}>
            <div className="info">
              <label htmlFor={option.id}>{option.label}</label>
              <div className="sub-info">{option.description}</div>
            </div>
            <div className="inputs">
              <input
                onChange={handleCheckboxChange}
                type={option.type}
                id={option.id}
                checked={popupOptions[option.id]}
              />
            </div>
          </SOption>
        ))}
        <SOption>
          <div className="info">
            <label htmlFor={'today-count'}>Today Limit</label>
            <div className="sub-info">
              The APOD for today will be shown this number of times before
              switching to random.
            </div>
          </div>
          <div className="inputs">
            <input
              disabled={!popupOptions[IS_TODAY_LIMIT_ON]}
              onChange={(event) => {
                setChrome({ [TODAY_LIMIT]: +event.target.value });
              }}
              defaultValue={popupOptions[TODAY_LIMIT]}
              type="number"
              id="today-count"
            />
          </div>
        </SOption>
      </SOptionsContainer>
      <SAboutApod>
        <p>
          APOD By The Trav <span id="version">v{manifest.version}</span>
        </p>
        <SAboutLinks>
          <div>
            <a target="_blank" href="https://www.redundantrobot.com">
              RedundantRobot
            </a>
          </div>
          <div>
            <a target="_blank" href="https://www.github.com/travisl12">
              Github
            </a>
          </div>
          <div>
            <a target="_blank" href="https://www.twitter.com/travisl12">
              Twitter
            </a>
          </div>
          <div>
            <a target="_blank" href="https://codepen.io/TravisL12">
              CodePen
            </a>
          </div>
        </SAboutLinks>
      </SAboutApod>
    </SPopupContainer>
  );
};

export default Popup;
