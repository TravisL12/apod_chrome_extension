import React, { useState } from "react";
import ExplanationTab from "./tabs/ExplanationTab";
import FavoritesTab from "./tabs/FavoritesTab";
import { keys, startCase } from "lodash";
import celestialDictionary from "../CelestialDictionary";

function findCelestialObjects(explanation) {
  const celestialObjects = keys(celestialDictionary).reduce(
    (result, category) => {
      const match = celestialDictionary[category].filter(constellation => {
        const re = new RegExp("\\b" + constellation + "\\b", "gi");
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

function Tab({ name, updateDrawer }) {
  return (
    <div
      className="tab"
      onClick={() => {
        updateDrawer(name);
      }}
    >
      {startCase(name)}
    </div>
  );
}

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

  if (response) {
    console.log(findCelestialObjects(response.explanation));
  }

  return (
    <div className={`apod__drawer ${openTabName ? "show" : ""}`}>
      <div className="apod__drawer-tabs">
        <div className="default-tabs">
          <Tab name={"favorites"} updateDrawer={updateDrawer} />
          <Tab name={"explanation"} updateDrawer={updateDrawer} />
        </div>

        <div className="apod__know-more" />
      </div>
      <div className="apod__drawer-view">{tabs[openTabName]}</div>
    </div>
  );
}
