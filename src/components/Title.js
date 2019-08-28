import React from "react";
import Flatpickr from "react-flatpickr";
import {
  actualDate,
  prettyDateFormat,
  isToday,
  today,
  MIN_APOD_DATE
} from "../DateManager";

function Title({
  response: { title, date },
  isImageHD,
  dateNavigation,
  specificDate,
  isFavorite
}) {
  const {
    previous,
    next,
    current,
    random,
    forceHighDef,
    saveFavorite
  } = dateNavigation;

  return (
    <div className="explanation">
      <div className="title">
        <div className="date">
          <Flatpickr
            value={actualDate(date)}
            options={{
              wrap: true,
              static: true,
              minDate: MIN_APOD_DATE,
              maxDate: today()
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
        <li onClick={current}>Today</li>
        <li onClick={random}>Random</li>
        {date !== MIN_APOD_DATE && <li onClick={previous}>Previous</li>}
        {!isToday(date) && <li onClick={next}>Next</li>}
        {isFavorite ? (
          <li className="favorite">Favorite!</li>
        ) : (
          <li onClick={saveFavorite}>Save</li>
        )}
        {!isImageHD && <li onClick={forceHighDef}>Force HD</li>}
      </ul>
    </div>
  );
}

export default Title;
