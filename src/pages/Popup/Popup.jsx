import React, { useState, useEffect } from 'react';
import './index.css';
import {
  IS_TODAY_APOD,
  HI_RES_ONLY,
  SHOW_TOP_SITES,
  IS_TODAY_LIMIT_ON,
  DEFAULT_OPTIONS,
  APOD_OPTIONS,
  TODAY_LIMIT,
} from '../../constants';
import { getChrome, setChrome } from '../../utilities';
import sunIcon from '../../assets/img/sun_loader.gif';
import {
  SOption,
  SToggle,
  SPopupContainer,
  SOptionsContainer,
  SHeader,
  SLimitRow,
  SAboutApod,
  SAboutLinks,
} from './styles';

const manifest = chrome.runtime.getManifest();

const MIN_TODAY_LIMIT = 1;
const MAX_TODAY_LIMIT = 99;

const clampLimit = (raw) => {
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return Math.min(MAX_TODAY_LIMIT, Math.max(MIN_TODAY_LIMIT, parsed));
};

const optionsConfig = [
  {
    id: IS_TODAY_APOD,
    label: "Show Today's APOD",
    description: `Will load the current APOD, otherwise will show a random APOD.`,
  },
  {
    id: HI_RES_ONLY,
    label: 'High Resolution Images Only',
    description: `When turned off, the standard image loads if the HD image takes too long.`,
  },
  {
    id: SHOW_TOP_SITES,
    label: 'Show Top Sites',
    description: `This will show/hide the Top Site icons.`,
  },
  {
    id: IS_TODAY_LIMIT_ON,
    label: 'Switch from Today to Random',
    description: `Show today's APOD a set number of times, then switch to random APOD's for the rest of your new tabs.`,
  },
];

const aboutLinks = [
  { label: 'RedundantRobot', href: 'https://www.redundantrobot.com' },
  { label: 'Github', href: 'https://www.github.com/travisl12' },
  { label: 'Twitter', href: 'https://www.twitter.com/travisl12' },
  { label: 'CodePen', href: 'https://codepen.io/TravisL12' },
];

const Popup = () => {
  const [popupOptions, setPopupOptions] = useState();
  const [limitInput, setLimitInput] = useState('');

  useEffect(() => {
    getChrome(APOD_OPTIONS, (options) => {
      const merged = { ...DEFAULT_OPTIONS, ...options };
      setPopupOptions(merged);
      setLimitInput(`${merged[TODAY_LIMIT]}`);
    });
  }, []);

  const updateOption = (key, value) => {
    setChrome({ [key]: value }, () => {
      setPopupOptions((current) => ({ ...current, [key]: value }));
    });
  };

  const handleCheckboxChange = (event) => {
    updateOption(event.target.id, event.target.checked);
  };

  if (!popupOptions) {
    return null;
  }

  const isLimitOn = popupOptions[IS_TODAY_LIMIT_ON];

  return (
    <SPopupContainer>
      <SHeader>
        <img src={sunIcon} alt="" />
        <div>
          <h1>Astronomy Picture of the Day</h1>
          <div className="subtitle">v{manifest.version}</div>
        </div>
      </SHeader>
      <SOptionsContainer>
        {optionsConfig.map((option) => (
          <SOption key={option.id}>
            <label className="main" htmlFor={option.id}>
              <div className="info">
                <div className="title">{option.label}</div>
                <div className="sub-info">{option.description}</div>
              </div>
              <SToggle>
                <input
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  id={option.id}
                  checked={popupOptions[option.id]}
                />
              </SToggle>
            </label>
            {option.id === IS_TODAY_LIMIT_ON && isLimitOn && (
              <SLimitRow>
                <label htmlFor="today-count">
                  Views of today's APOD before switching
                </label>
                <input
                  onChange={(event) => {
                    // Keep whatever is typed (including an empty field
                    // mid-edit) and only persist once it reads as a number;
                    // blur snaps it back into range.
                    setLimitInput(event.target.value);
                    const value = clampLimit(event.target.value);
                    if (value !== null) {
                      updateOption(TODAY_LIMIT, value);
                    }
                  }}
                  onBlur={() => {
                    const value =
                      clampLimit(limitInput) ?? popupOptions[TODAY_LIMIT];
                    setLimitInput(`${value}`);
                    updateOption(TODAY_LIMIT, value);
                  }}
                  value={limitInput}
                  min={MIN_TODAY_LIMIT}
                  max={MAX_TODAY_LIMIT}
                  type="number"
                  id="today-count"
                />
              </SLimitRow>
            )}
          </SOption>
        ))}
      </SOptionsContainer>
      <SAboutApod>
        <SAboutLinks>
          {aboutLinks.map(({ label, href }) => (
            <a
              key={label}
              target="_blank"
              rel="noopener noreferrer"
              href={href}
            >
              {label}
            </a>
          ))}
        </SAboutLinks>
      </SAboutApod>
    </SPopupContainer>
  );
};

export default Popup;
