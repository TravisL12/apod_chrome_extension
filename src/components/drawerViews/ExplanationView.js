import React from "react";
import { downloadImage } from "../../utilities";

function ExplanationTab({
  response: { title, explanation, hdurl, url, copyright },
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

      <div onClick={() => downloadImage(hdurl)} className="download-image">
        Download High Resolution Image
      </div>
      <div onClick={() => downloadImage(url)} className="download-image">
        Download Low Resolution Image
      </div>
    </div>
  );
}

export default ExplanationTab;
