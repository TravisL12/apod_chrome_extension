import React from "react";
import ViewItem from "./ViewItem";

function HistoryView({ historyHelper, specificDate, closeDrawer }) {
  const { dates, responses } = historyHelper;

  return (
    <div className="favorites">
      <h2>Recent Viewed APOD's</h2>
      <div className="drawer-list">
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
      </div>
    </div>
  );
}

export default HistoryView;
