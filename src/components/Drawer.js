import React, { useState } from "react";
import ExplanationTab from "./tabs/ExplanationTab";
import FavoritesTab from "./tabs/FavoritesTab";

export default function Drawer({ response, favorites, specificDate }) {
  const [openTabName, setOpenTabName] = useState(false);

  const tabs = {
    explanation: <ExplanationTab response={response} />,
    favorites: (
      <FavoritesTab favorites={favorites} specificDate={specificDate} />
    )
  };

  const updateDrawer = tabName => {
    openTabName && tabName === openTabName
      ? setOpenTabName(false)
      : setOpenTabName(tabName);
  };

  return (
    <div className={`apod__drawer ${openTabName ? "show" : ""}`}>
      <div className="apod__drawer-tabs">
        <div className="default-tabs">
          <div
            className="tab"
            onClick={() => {
              updateDrawer("favorites");
            }}
          >
            Favorites
          </div>
          <div
            className="tab"
            onClick={() => {
              updateDrawer("explanation");
            }}
          >
            Explanation
          </div>
        </div>

        <div className="apod__know-more" />
      </div>
      <div className="apod__drawer-view">{tabs[openTabName]}</div>
    </div>
  );
}
