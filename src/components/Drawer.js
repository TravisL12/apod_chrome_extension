import React, { useState } from "react";
import { keys, startCase, countBy } from "lodash";
import { GlobalHotKeys } from "react-hotkeys";

import ExplanationView from "./drawerViews/ExplanationView";
import FavoritesView from "./drawerViews/FavoritesView";
import SearchView from "./drawerViews/SearchView";
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
  const [isOpen, setIsOpen] = useState(false);
  const [openTabName, setOpenTabName] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(null);

  const closeDrawer = () => {
    setIsOpen(false);
  };

  if (!response) {
    return null;
  }

  const celestialObjects = keys(
    countBy(findCelestialObjects(response.description))
  )
    .slice(0, MAX_CELESTIAL_MATCHES)
    .map((match) => match.toLowerCase());

  const openSearchView = (keyword = searchKeyword) => {
    setSearchKeyword(keyword);
    updateDrawer("search");
  };

  const tabViews = {
    explanation: (
      <ExplanationView
        response={response}
        celestialObjects={celestialObjects}
        openSearchView={openSearchView}
      />
    ),
    favorites: (
      <FavoritesView
        favorites={favorites}
        closeDrawer={closeDrawer}
        specificDate={specificDate}
      />
    ),
    search: (
      <SearchView
        keyword={searchKeyword}
        closeDrawer={closeDrawer}
        specificDate={specificDate}
        setSearchKeyword={setSearchKeyword}
      />
    ),
  };

  const updateDrawer = (tabName) => {
    if ((isOpen && tabName === openTabName) || !response) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setOpenTabName(tabName);
    }
  };

  const { keyMap, handlers } = {
    keyMap: { ...KEY_MAP },
    handlers: {
      EXPLANATION_TAB: () => {
        updateDrawer("explanation");
      },
      FAVORITES_TAB: () => {
        updateDrawer("favorites");
      },
      SEARCH_TAB: () => {
        updateDrawer("search");
      },
      CLOSE_DRAWER: closeDrawer,
    },
  };

  return (
    <div className={`apod__drawer ${isOpen ? "show" : ""}`}>
      <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers} />
      <div className="apod__drawer-tabs">
        <div className="tabs">
          {keys(tabViews).map((tabName, idx) => (
            <Tab
              key={idx}
              name={tabName}
              isActive={isOpen && openTabName === tabName}
              onClickHandler={updateDrawer}
            />
          ))}
        </div>
      </div>
      <div className="apod__drawer-view">{tabViews[openTabName]}</div>
    </div>
  );
}
