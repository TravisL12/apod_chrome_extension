import React, { memo } from 'react';
import Flatpickr from 'react-flatpickr';
import DatePicker from './DatePicker';
import {
  actualDate,
  prettyDateFormat,
  isToday,
  today,
  MIN_APOD_DATE,
} from '../utilities/dateUtility';

function Title({
  response: { title, date, apod_site },
  isImageHD,
  dateNavigation,
  specificDate,
  isFavorite,
}) {
  const {
    previous,
    next,
    current,
    random,
    forceHighDef,
    saveFavorite,
  } = dateNavigation;

  const todayLink = !isToday(date) && <li onClick={current}>Today</li>;
  const highDefLink = !isImageHD && <li onClick={forceHighDef}>Force HD</li>;
  const nextLink = !isToday(date) && <li onClick={next}>Next</li>;
  const previousLink = date !== MIN_APOD_DATE && (
    <li onClick={previous}>Previous</li>
  );
  const favoriteLink = isFavorite ? (
    <li className="favorite">Favorite!</li>
  ) : (
    <li onClick={saveFavorite}>Save</li>
  );

  return (
    <div className="title-container">
      <div className="title">
        <div className="date">
          <Flatpickr
            value={actualDate(date)}
            options={{
              wrap: true,
              static: true,
              minDate: MIN_APOD_DATE,
              maxDate: today(),
            }}
            onChange={(date, dateStr) => {
              specificDate(dateStr);
            }}
          >
            <input type="text" data-input style={{ display: 'none' }} />
            <h2 data-toggle>{prettyDateFormat(date)}</h2>
          </Flatpickr>
        </div>

        <h1>{title}</h1>
        <span className="img-quality">{isImageHD ? 'HD' : 'SD'}</span>
      </div>

      <ul className="nav-buttons">
        {todayLink}
        <li onClick={random}>Random</li>
        {previousLink}
        {nextLink}
        {favoriteLink}
        <li className="apod-link">
          <a href={apod_site} target="_blank" rel="noopener noreferrer">
            APOD
          </a>
        </li>
        {highDefLink}
      </ul>
    </div>
  );
}

export default memo(Title);
