import React, { useState, useEffect } from 'react';
import './index.css';
import {
  IS_TODAY_APOD,
  HI_RES_ONLY,
  SHOW_TOP_SITES,
  IS_TODAY_LIMIT_ON,
  DEFAULT_OPTIONS,
  APOD_OPTIONS,
} from '../../constants';
import { getChrome, setChrome } from '../../utilities';
import {
  SOption,
  SPopupContainer,
  SOptionsContainer,
  SAboutApod,
  SAboutLinks,
} from './styles';

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
    description: `Show today's APOD up to this limit and then show random APOD's.`,
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
        {optionsConfig.map((option) => {
          return (
            <SOption key={option.id} className="option">
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
          );
        })}
      </SOptionsContainer>
      <SAboutApod>
        <p>
          APOD By The Trav <span id="version"></span>
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
