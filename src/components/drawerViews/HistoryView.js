import React from "react";
import ViewItem from "./ViewItem";

function HistoryView({ history, specificDate, closeDrawer }) {
  const { dates, responses } = history;

  return (
    <div className="favorites">
      <h2>Recent Viewed APOD's</h2>
      <ul id="drawer-list">
        {dates.map((date, idx) => {
          const { title } = responses[date];

          return (
            <ViewItem
              key={idx}
              title={title}
              date={date}
              specificDate={specificDate}
              closeDrawer={closeDrawer}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default HistoryView;
