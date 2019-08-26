import React, { useState } from "react";
import reqwest from "reqwest";
import { keys, startCase, countBy } from "lodash";

import ExplanationTab from "./tabs/ExplanationTab";
import FavoritesTab from "./tabs/FavoritesTab";
import celestialDictionary from "../CelestialDictionary";
import KnowMoreTab from "./tabs/KnowMoreTab";

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
    ),
    knowMore: <KnowMoreTab />
  };

  const updateDrawer = tabName => {
    openTabName && tabName === openTabName
      ? setOpenTabName(false)
      : setOpenTabName(tabName);
  };

  const knowMoreDisplay = keyword => {
    reqwest({
      method: "POST",
      url: "https://apod.nasa.gov/cgi-bin/apod/apod_search",
      data: {
        tquery: keyword
      }
    }).then(resp => {
      const searchDom = new DOMParser();
      const searchHtml = searchDom.parseFromString(resp, "text/html");
      const searches = searchHtml.querySelectorAll("p");
      const searchResult = [];
      for (let i = 0; i < searches.length; i++) {
        const search = searches[i];
        const parse = search.querySelectorAll("a")[1];

        if (parse) {
          searchResult.push({
            title: parse.textContent.replace(/(\r\n|\n|\r)/gm, "").trim(), // remove line breaks Regex
            url: parse.href
          });
        }
      }
      console.log(searchResult);
    });
  };

  const celestialObjects = response
    ? keys(countBy(findCelestialObjects(response.explanation)))
    : [];

  return (
    <div className={`apod__drawer ${openTabName ? "show" : ""}`}>
      <div className="apod__drawer-tabs">
        <div className="default-tabs">
          {celestialObjects.slice(0, 5).map((obj, idx) => {
            return <Tab name={obj} updateDrawer={knowMoreDisplay} />;
          })}
          <Tab name={"favorites"} updateDrawer={updateDrawer} />
          <Tab name={"explanation"} updateDrawer={updateDrawer} />
        </div>

        <div className="apod__know-more" />
      </div>
      <div className="apod__drawer-view">{tabs[openTabName]}</div>
    </div>
  );
}
