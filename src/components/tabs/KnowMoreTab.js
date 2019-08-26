import React from "react";
import { apodSourceLink } from "../../utilities";

function KnowMoreTab({ response: { title, date, explanation, hdurl, url } }) {
  return (
    <div className="explanation-tab">
      <h2 className="title">{title}</h2>

      <div className="explanation">{explanation}</div>

      <div className="external-links">
        <a
          href={`https://apod.nasa.gov/apod/${apodSourceLink(date)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View this APOD
        </a>
        <a href={hdurl} target="_blank" rel="noopener noreferrer">
          Hi-res
        </a>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Low-res
        </a>
      </div>
    </div>
  );
}

export default KnowMoreTab;
