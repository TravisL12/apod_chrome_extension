import React, { useState } from "react";
import { keys, startCase, countBy } from "lodash";
import { GlobalHotKeys } from "react-hotkeys";

import ExplanationTab from "./tabs/ExplanationTab";
import FavoritesTab from "./tabs/FavoritesTab";
import KnowMoreTab from "./tabs/KnowMoreTab";
import { findCelestialObjects, KEY_MAP } from "../utilities";

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
  const [activeTabName, setActiveTabName] = useState(false);

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
      setActiveTabName(false);
    } else {
      setOpenTabName(tabName);
      setActiveTabName(tabName);
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
      setActiveTabName(keyword);
    } else {
      setKnowMoreKeyword(null);
      setOpenTabName(false);
      setActiveTabName(false);
    }
  };

  const celestialObjects = response
    ? keys(countBy(findCelestialObjects(response.explanation))).slice(
        0,
        MAX_CELESTIAL_MATCHES
      )
    : [];

  const { keyMap, handlers } = celestialObjects.reduce(
    (result, keyword, idx) => {
      result.keyMap[`KEYWORD_${keyword}`] = String(idx + 1);
      result.handlers[`KEYWORD_${keyword}`] = () => {
        knowMoreMatch(keyword);
      };
      return result;
    },
    {
      keyMap: { ...KEY_MAP },
      handlers: {
        EXPLANATION_TAB: () => {
          updateDrawer("explanation");
        },
        FAVORITES_TAB: () => {
          updateDrawer("favorites");
        },
        CLOSE_DRAWER: closeDrawer
      }
    }
  );

  return (
    <div className={`apod__drawer ${openTabName ? "show" : ""}`}>
      <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers} />
      <div className="apod__drawer-tabs">
        <div className="tabs">
          {celestialObjects.map((name, idx) => {
            return (
              <Tab
                key={idx}
                name={name}
                isActive={activeTabName === name}
                onClickHandler={knowMoreMatch}
              />
            );
          })}
          <Tab
            name={"favorites"}
            isActive={activeTabName === "favorites"}
            onClickHandler={updateDrawer}
          />
          <Tab
            name={"explanation"}
            isActive={activeTabName === "explanation"}
            onClickHandler={updateDrawer}
          />
        </div>
      </div>
      <div className="apod__drawer-view">{tabViews[openTabName]}</div>
    </div>
  );
}
