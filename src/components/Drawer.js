import React, { useState } from "react";
import { keys, startCase, countBy } from "lodash";

import ExplanationTab from "./tabs/ExplanationTab";
import FavoritesTab from "./tabs/FavoritesTab";
import KnowMoreTab from "./tabs/KnowMoreTab";
import { findCelestialObjects } from "../utilities";

const MAX_CELESTIAL_MATCHES = 5;

function Tab({ name, onClickHandler, isActive }) {
  return (
    <div
      className={`tab ${isActive ? "is-open" : ""}`}
      onClick={() => {
        onClickHandler(name);
      }}
    >
      {startCase(name)}
    </div>
  );
}

export default function Drawer({ response, favorites, specificDate }) {
  const [openTabName, setOpenTabName] = useState(false);
  const [knowMoreKeyword, setKnowMoreKeyword] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const closeDrawer = () => {
    setOpenTabName(false);
  };

  const tabViews = {
    explanation: <ExplanationTab response={response} />,
    favorites: (
      <FavoritesTab
        favorites={favorites}
        closeDrawer={closeDrawer}
        specificDate={specificDate}
      />
    ),
    knowMore: (
      <KnowMoreTab
        keyword={knowMoreKeyword}
        closeDrawer={closeDrawer}
        specificDate={specificDate}
      />
    )
  };

  const updateDrawer = tabName => {
    if ((openTabName && tabName === openTabName) || !response) {
      setOpenTabName(false);
      setIsActive(false);
    } else {
      setOpenTabName(tabName);
      setIsActive(tabName);
    }
  };

  const knowMoreMatch = keyword => {
    if (
      !openTabName ||
      (openTabName && knowMoreKeyword !== keyword) ||
      (openTabName && openTabName !== "knowMore")
    ) {
      setKnowMoreKeyword(keyword);
      setOpenTabName("knowMore");
      setIsActive(keyword);
    } else {
      setKnowMoreKeyword(null);
      setOpenTabName(false);
      setIsActive(false);
    }
  };

  const celestialObjects = response
    ? keys(countBy(findCelestialObjects(response.explanation)))
    : [];

  return (
    <div className={`apod__drawer ${openTabName ? "show" : ""}`}>
      <div className="apod__drawer-tabs">
        <div className="tabs">
          {celestialObjects.slice(0, MAX_CELESTIAL_MATCHES).map((name, idx) => {
            return (
              <Tab
                key={idx}
                name={name}
                isActive={isActive === name}
                onClickHandler={knowMoreMatch}
              />
            );
          })}
          <Tab
            name={"favorites"}
            isActive={isActive === "favorites"}
            onClickHandler={updateDrawer}
          />
          <Tab
            name={"explanation"}
            isActive={isActive === "explanation"}
            onClickHandler={updateDrawer}
          />
        </div>
      </div>
      <div className="apod__drawer-view">{tabViews[openTabName]}</div>
    </div>
  );
}
