import React, { useState } from "react";
import reqwest from "reqwest";
import { keys, startCase, countBy } from "lodash";

import ExplanationTab from "./tabs/ExplanationTab";
import FavoritesTab from "./tabs/FavoritesTab";
import celestialDictionary from "../CelestialDictionary";
import KnowMoreTab from "./tabs/KnowMoreTab";
import { formatDate } from "../DateManager";

const MAX_CELESTIAL_MATCHES = 5;
const MAX_CELESTIAL_DISPLAYED = 20;

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
  const [knowMoreResults, setKnowMoreResults] = useState(null);

  const tabs = {
    explanation: <ExplanationTab response={response} />,
    favorites: (
      <FavoritesTab favorites={favorites} specificDate={specificDate} />
    ),
    knowMore: <KnowMoreTab results={knowMoreResults} />
  };

  const updateDrawer = tabName => {
    openTabName && tabName === openTabName
      ? setOpenTabName(false)
      : setOpenTabName(tabName);
  };

  const knowMoreMatch = keyword => {
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

      for (let i = 0; i < MAX_CELESTIAL_DISPLAYED; i++) {
        const search = searches[i];
        const parse = search.querySelectorAll("a")[1];

        if (parse) {
          const date = parse.textContent.match(/(?<=APOD:\s).*(?=\s-)/)[0];
          const title = parse.textContent.replace(/(\r\n|\n|\r)/gm, "").trim(); // remove line breaks Regex

          searchResult.push({
            title,
            url: parse.href,
            date: formatDate(new Date(date))
          });
        }
      }

      setKnowMoreResults(searchResult);
      setOpenTabName("knowMore");
    });
  };

  const celestialObjects = response
    ? keys(countBy(findCelestialObjects(response.explanation)))
    : [];

  return (
    <div className={`apod__drawer ${openTabName ? "show" : ""}`}>
      <div className="apod__drawer-tabs">
        <div className="default-tabs">
          {celestialObjects.slice(0, MAX_CELESTIAL_MATCHES).map((obj, idx) => {
            return <Tab key={idx} name={obj} updateDrawer={knowMoreMatch} />;
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
