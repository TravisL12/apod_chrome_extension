import React from "react";
import DatePicker from "react-datepicker";
import { actualDate, prettyDateFormat, formatDate } from "../DateManager";

function Title({
  response: { title, date },
  isImageHD,
  dateNavigation,
  specificDate
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
          <DatePicker
            showYearDropdown
            scrollableYearDropdown
            customInput={<h2>{prettyDateFormat(date)}</h2>}
            selected={actualDate(date)}
            onChange={date => {
              specificDate(formatDate(date));
            }}
          />
        </div>

        <h1>{title}</h1>
        <span className="img-quality">{isImageHD ? "HD" : "SD"}</span>
      </div>

      <ul className="nav-buttons">
        <li onClick={current}>Today</li>
        <li onClick={random}>Random</li>
        <li onClick={previous}>Previous</li>
        <li onClick={next}>Next</li>
        <li onClick={saveFavorite} className="add-favorite">
          Save
        </li>
        <li onClick={forceHighDef}>Force HD</li>
      </ul>
    </div>
  );
}

export default Title;
