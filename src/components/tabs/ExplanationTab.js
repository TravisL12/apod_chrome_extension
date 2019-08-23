import React from "react";
import { apodSourceLink } from "../../utilities";

function ExplanationTab({
  response: { title, date, explanation, hdurl, url }
}) {
  return (
    <div className="explanation-tab">
      <h2 className="title">{title}</h2>

      <div className="explanation">{explanation}</div>

      <div className="external-links">
        <a href={apodSourceLink(date)} target="_blank">
          View this APOD
        </a>
        <a href={hdurl} target="_blank">
          Hi-res
        </a>
        <a href={url} target="_blank">
          Low-res
        </a>
      </div>
    </div>
  );
}

export default ExplanationTab;
