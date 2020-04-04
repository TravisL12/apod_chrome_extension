import React from "react";
import { downloadImage } from "../../utilities";

function ExplanationTab({
  response: { title, description, hdurl, url, copyright },
  celestialObjects,
  openSearchView,
}) {
  const re = new RegExp(`(${celestialObjects.join("|")})`, "gi");
  const explanationSplit = description.split(re);

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

      <div className="download-image">
        High Resolution Image{" "}
        <div className="links">
          <span onClick={() => downloadImage(hdurl)}>Download</span>{" "}
          <a rel="noopener noreferrer" href={hdurl} target="_blank">
            View
          </a>
        </div>
      </div>
      <div className="download-image">
        Low Resolution Image
        <div className="links">
          <span onClick={() => downloadImage(url)}>Download</span>{" "}
          <a rel="noopener noreferrer" href={url} target="_blank">
            View
          </a>
        </div>
      </div>
    </div>
  );
}

export default ExplanationTab;
