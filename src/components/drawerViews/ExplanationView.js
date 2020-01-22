import React from "react";
import { downloadImage } from "../../utilities";

function ExplanationTab({
  response: { title, date, explanation, hdurl, url, copyright },
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

      {copyright && <div className="copyright">Copyright: {copyright}</div>}

      <div className="external-links">
        <span onClick={() => downloadImage(hdurl)} className="download-image">
          Download Hi-res
        </span>
        <span onClick={() => downloadImage(url)} className="download-image">
          Download Low-res
        </span>
      </div>
    </div>
  );
}

export default ExplanationTab;
