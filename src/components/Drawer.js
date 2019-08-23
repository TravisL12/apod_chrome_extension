import React, { useState } from "react";
import ExplanationTab from "./tabs/ExplanationTab";
import FavoritesTab from "./tabs/FavoritesTab";

export default function Drawer({ response }) {
  const [openTab, setOpenTab] = useState(false);
  const explanationTab = <ExplanationTab response={response} />;
  const favoritesTab = <FavoritesTab />;

  const updateDrawer = tab => {
    openTab ? setOpenTab(false) : setOpenTab(tab);
  };

  return (
    <div className={`apod__drawer ${openTab ? "show" : ""}`}>
      <div className="apod__drawer-tabs">
        <div className="default-tabs">
          <div
            className="tab"
            onClick={() => {
              updateDrawer(favoritesTab);
            }}
          >
            Favorites
          </div>
          <div
            className="tab"
            onClick={() => {
              updateDrawer(explanationTab);
            }}
          >
            Explanation
          </div>
        </div>

        <div className="apod__know-more" />
      </div>
      <div className="apod__drawer-view">{openTab}</div>
    </div>
  );
}
