import React from "react";
import Flatpickr from "react-flatpickr";
import {
  actualDate,
  prettyDateFormat,
  isToday,
  today,
  MIN_APOD_DATE,
} from "../utilities/dateUtility";

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
            <input type="text" data-input style={{ display: "none" }} />
            <h2 data-toggle>{prettyDateFormat(date)}</h2>
          </Flatpickr>
        </div>

        <h1>{title}</h1>
        <span className="img-quality">{isImageHD ? "HD" : "SD"}</span>
      </div>

      <ul className="nav-buttons">
        {!isToday(date) && <li onClick={current}>Today</li>}
        <li onClick={random}>Random</li>
        {date !== MIN_APOD_DATE && <li onClick={previous}>Previous</li>}
        {!isToday(date) && <li onClick={next}>Next</li>}
        {isFavorite ? (
          <li className="favorite">Favorite!</li>
        ) : (
          <li onClick={saveFavorite}>Save</li>
        )}
        <li className="apod-link">
          <a href={apod_site} target="_blank" rel="noopener noreferrer">
            APOD
          </a>
        </li>
        {!isImageHD && <li onClick={forceHighDef}>Force HD</li>}
      </ul>
    </div>
  );
}

export default Title;
