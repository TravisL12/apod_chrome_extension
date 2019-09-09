import React, { useState } from "react";
import { isEmpty, keys, startCase, countBy } from "lodash";
import { GlobalHotKeys } from "react-hotkeys";

import ExplanationView from "./drawerViews/ExplanationView";
import FavoritesView from "./drawerViews/FavoritesView";
import SearchView from "./drawerViews/SearchView";
import { findCelestialObjects, KEY_MAP } from "../utilities";
import HistoryView from "./drawerViews/HistoryView";

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

export default function Drawer({
  response,
  favorites,
  specificDate,
  historyHelper
}) {
  const [openTabName, setOpenTabName] = useState(false);
  const [knowMoreKeyword, setKnowMoreKeyword] = useState(null);
  const [activeTabName, setActiveTabName] = useState(false);

  const closeDrawer = () => {
    setOpenTabName(false);
  };

  const tabViews = {
    explanation: <ExplanationView response={response} />,
    favorites: (
      <FavoritesView
        favorites={favorites}
        closeDrawer={closeDrawer}
        specificDate={specificDate}
      />
    ),
    history: (
      <HistoryView
        historyHelper={historyHelper}
        closeDrawer={closeDrawer}
        specificDate={specificDate}
      />
    ),
    search: (
      <SearchView
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

  const celestialObjects = keys(
    countBy(findCelestialObjects(response.explanation))
  ).slice(0, MAX_CELESTIAL_MATCHES);

  const { keyMap, handlers } = {
    keyMap: { ...KEY_MAP },
    handlers: {
      EXPLANATION_TAB: () => {
        updateDrawer("explanation");
      },
      FAVORITES_TAB: () => {
        updateDrawer("favorites");
      },
      HISTORY_TAB: () => {
        updateDrawer("history");
      },
      SEARCH_TAB: () => {
        updateDrawer("search");
      },
      CLOSE_DRAWER: closeDrawer
    }
  };

  return (
    <div className={`apod__drawer ${openTabName ? "show" : ""}`}>
      <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers} />
      <div className="apod__drawer-tabs">
        <div className="tabs">
          <Tab
            name={"explanation"}
            isActive={activeTabName === "explanation"}
            onClickHandler={updateDrawer}
          />
          <Tab
            name={"favorites"}
            isActive={activeTabName === "favorites"}
            onClickHandler={updateDrawer}
          />
          {!isEmpty(historyHelper.dates) && (
            <Tab
              name={"history"}
              isActive={activeTabName === "history"}
              onClickHandler={updateDrawer}
            />
          )}
          <Tab
            name={"search"}
            isActive={activeTabName === "search"}
            onClickHandler={updateDrawer}
          />
        </div>
      </div>
      <div className="apod__drawer-view">{tabViews[openTabName]}</div>
    </div>
  );
}
