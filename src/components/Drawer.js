import React, { useState } from "react";
import { keys, startCase, countBy } from "lodash";

import ExplanationTab from "./tabs/ExplanationTab";
import FavoritesTab from "./tabs/FavoritesTab";
import celestialDictionary from "../CelestialDictionary";
import KnowMoreTab from "./tabs/KnowMoreTab";

const MAX_CELESTIAL_MATCHES = 5;

function findCelestialObjects(explanation) {
  const celestialObjects = keys(celestialDictionary).reduce(
    (result, category) => {
      const match = celestialDictionary[category].filter(constellation => {
        const re = new RegExp(`\\b${constellation}\\b`, "gi");
        return explanation.match(re);
      });

      return result.concat(match);
    },
    []
  );

  const ngcObjects = explanation.match(/NGC(-|\s)?\d{1,7}/gi) || [];

  const results = new Set(celestialObjects.concat(ngcObjects)); // get unique values
  return [...results];
}

function Tab({ name, onClickHandler }) {
  return (
    <div
      className="tab"
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

  const closeDrawer = () => {
    setOpenTabName(false);
  };

  const tabs = {
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
    (openTabName && tabName === openTabName) || !response
      ? setOpenTabName(false)
      : setOpenTabName(tabName);
  };

  const knowMoreMatch = keyword => {
    if (
      !openTabName ||
      (openTabName && knowMoreKeyword !== keyword) ||
      (openTabName && openTabName !== "knowMore")
    ) {
      setKnowMoreKeyword(keyword);
      setOpenTabName("knowMore");
    } else {
      setKnowMoreKeyword(null);
      setOpenTabName(false);
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
            return <Tab key={idx} name={name} onClickHandler={knowMoreMatch} />;
          })}
          <Tab name={"favorites"} onClickHandler={updateDrawer} />
          <Tab name={"explanation"} onClickHandler={updateDrawer} />
        </div>
      </div>
      <div className="apod__drawer-view">{tabs[openTabName]}</div>
    </div>
  );
}
