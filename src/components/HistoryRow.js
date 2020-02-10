import React from "react";

export default function HistoryRow({
  historyHelper,
  specificDate,
  activeResponse
}) {
  const { responses } = historyHelper;

  return (
    <div className={`history ${responses.length ? "show" : ""}`}>
      {responses.map(response => {
        const { date, url } = response;

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
            <div className="history__thumb">
              <img alt="Thumb" src={url} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
