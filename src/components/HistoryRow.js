import React, { useState, useCallback, memo } from "react";

const ImageLoader = memo(({ url }) => {
  const [image, setImage] = useState(undefined);
  const thumbImage = new Image();
  thumbImage.src = url;
  thumbImage.onload = useCallback(() => {
    setImage(url);
  }, [url]);

  return !image ? (
    <div className="history__thumb-image loading" />
  ) : (
    <div className={"history__thumb-image"}>
      <img alt="APOD Thumb" src={image} />
    </div>
  );
});

function HistoryRow({ historyHelper, specificDate, activeResponse }) {
  const { responses } = historyHelper;

  return (
    <div className="history">
      {responses.map(({ title, date, url }) => {
        return (
          <div className="history__thumb">
            <span className="history__thumb-title">{title}</span>
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
          </div>
        );
      })}
    </div>
  );
}

export default memo(HistoryRow);
