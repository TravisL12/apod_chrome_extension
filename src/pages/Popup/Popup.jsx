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
  NEWTAB_VIEW,
  VIEW_APOD,
  VIEW_GRID,
  GRID_AUTO_SCROLL,
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
  SViewChoice,
  SViewButton,
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

const viewChoices = [
  { id: VIEW_APOD, label: 'Single APOD' },
  { id: VIEW_GRID, label: 'Image Grid' },
];

// `apodOnly` and `gridOnly` settings have nothing to act on in the other
// view, so they are hidden rather than left showing as no-ops.
const optionsConfig = [
  {
    id: IS_TODAY_APOD,
    label: "Show Today's APOD",
    description: `Will load the current APOD, otherwise will show a random APOD.`,
    apodOnly: true,
  },
  {
    id: HI_RES_ONLY,
    label: 'High Resolution Images Only',
    description: `When turned off, the standard image loads if the HD image takes too long.`,
    apodOnly: true,
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
    apodOnly: true,
  },
  {
    id: GRID_AUTO_SCROLL,
    label: 'Drift the Grid',
    description: `Slowly scrolls the image grid on its own, loading more as it goes. Pauses while you scroll and picks back up when you stop.`,
    gridOnly: true,
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
  const currentView = popupOptions[NEWTAB_VIEW] || VIEW_APOD;
  const visibleOptions = optionsConfig.filter((option) => {
    if (option.apodOnly) return currentView === VIEW_APOD;
    if (option.gridOnly) return currentView === VIEW_GRID;
    return true;
  });

  return (
    <SPopupContainer>
      <SHeader>
        <img src={sunIcon} alt="" />
        <div>
          <h1>Astronomy Picture of the Day</h1>
          <div className="subtitle">v{manifest.version}</div>
        </div>
      </SHeader>
      <SViewChoice>
        <div className="title">New Tab View</div>
        <div className="sub-info">
          Show one full-screen APOD, or a grid of images from NASA's public
          image library.
        </div>
        <div className="choices">
          {viewChoices.map((choice) => (
            <SViewButton
              key={choice.id}
              type="button"
              isActive={currentView === choice.id}
              aria-pressed={currentView === choice.id}
              onClick={() => updateOption(NEWTAB_VIEW, choice.id)}
            >
              {choice.label}
            </SViewButton>
          ))}
        </div>
      </SViewChoice>
      <SOptionsContainer>
        {visibleOptions.map((option) => (
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
