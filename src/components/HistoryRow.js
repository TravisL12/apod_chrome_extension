import React, { useState } from "react";

function ImageLoader({ url }) {
  const [image, setImage] = useState(undefined);
  const thumbImage = new Image();
  thumbImage.src = url;
  thumbImage.onload = () => {
    setImage(url);
  };

  return !image ? (
    <div className="history__thumb loading" />
  ) : (
    <div className={"history__thumb"}>
      <img alt="APOD Thumb" src={image} />
    </div>
  );
}

export default function HistoryRow({
  historyHelper,
  specificDate,
  activeResponse,
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
