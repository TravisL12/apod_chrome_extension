import React from "react";
import { prettyDateFormat } from "../../utilities/dateUtility";
import { thumbSourceLink } from "../../utilities";

function HistoryTab({ history, specificDate, closeDrawer }) {
  const { dates, responses } = history;

  return (
    <div className="favorites">
      <h2>Recent Viewed APOD's</h2>
      <ul id="drawer-list">
        {dates.map((date, idx) => {
          const response = responses[date];
          const thumbNailUrl = thumbSourceLink(date);

          return (
            <li className="favorite" key={idx}>
              <div
                onClick={() => {
                  specificDate(date);
                  closeDrawer();
                }}
                className="favorite__image"
              >
                <div className="favorite__image-image">
                  <img alt="Favorite" src={thumbNailUrl} />
                </div>
              </div>
              <div
                onClick={() => specificDate(date)}
                className="favorite__title"
              >
                <p className="favorite__title-date">{prettyDateFormat(date)}</p>
                <p className="favorite__title-title">{response.title}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default HistoryTab;
