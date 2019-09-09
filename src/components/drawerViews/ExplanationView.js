import React from "react";
import { apodSourceLink } from "../../utilities";

function ExplanationTab({
  response: { title, date, explanation, hdurl, url },
  celestialObjects,
  openSearchView
}) {
  const re = new RegExp(`(${celestialObjects.join("|")})`, "gi");
  const explanationSplit = explanation.split(re);

  return (
    <div className="explanation-tab">
      <h2 className="title">{title}</h2>

      <div className="explanation">
        {explanationSplit.map((phrase, idx) => {
          return celestialObjects.indexOf(phrase.toLowerCase()) > -1 ? (
            <span
              key={idx}
              onClick={() => openSearchView(phrase)}
              className="highlight"
            >
              {phrase}
            </span>
          ) : (
            <span key={idx}>{phrase}</span>
          );
        })}
      </div>

      <div className="external-links">
        <a
          href={apodSourceLink(date)}
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

export default ExplanationTab;
