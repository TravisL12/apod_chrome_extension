import React, { useState, useEffect } from 'react';
import './Popup.css';
import {
  APOD_TYPE,
  HI_RES_ONLY,
  APOD_FAVORITES,
  SHOW_TOP_SITES,
  SHOW_HISTORY_ROW,
  CURRENT_DATE,
  TODAY_COUNT,
  TODAY_LIMIT,
  IS_TODAY_LIMIT_ON,
  DEFAULT_OPTIONS,
  APOD_OPTIONS,
} from '../../constants';
import { getChrome, setChrome } from '../../utilities';

const optionsConfig = [
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
    id: SHOW_HISTORY_ROW,
    label: 'Show History',
    description: `This will show/hide the history row at the bottom of the page.`,
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
    <div>
      <h3>Options</h3>
      <div>
        {optionsConfig.map((option) => {
          return (
            <div key={option.id} className="option">
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Popup;
