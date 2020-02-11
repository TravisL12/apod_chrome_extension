import React, { useState } from "react";

import blackSpinner from "../ajax-loader-black.gif";

function ImageLoader({ url }) {
  const [image, setImage] = useState(blackSpinner);
  const thumbImage = new Image();
  thumbImage.src = url;
  thumbImage.onload = () => {
    setImage(url);
  };

  return (
    <div className="history__thumb">
      <img alt="APOD Thumb" src={image} />
    </div>
  );
}

export default function HistoryRow({
  historyHelper,
  specificDate,
  activeResponse
}) {
  const { responses } = historyHelper;

  return (
    <div className={`history ${responses.length ? "show" : ""}`}>
      {responses.map(({ date, url }) => {
        return (
          <div
            className={`history__thumb-border ${
              activeResponse && activeResponse.date === date
                ? "active-date"
                : ""
            }`}
            onClick={() => {
              specificDate(date);
            }}
          >
            <ImageLoader url={url} />
          </div>
        );
      })}
    </div>
  );
}
