import React, { useState, useEffect } from "react";
import axios from "axios";
import { startCase } from "lodash";

import ViewItem from "./ViewItem";
import { formatDate } from "../../utilities/dateUtility";
import { SunLoader } from "../LoadingSpinner";

const MAX_CELESTIAL_DISPLAYED = 20;
const cachedResults = {};

function SearchView({ keyword, specificDate, closeDrawer }) {
  const [results, setResults] = useState(null);

  useEffect(() => {
    setResults(null);

    if (cachedResults[keyword]) {
      setResults(cachedResults[keyword]);
      return;
    }

    axios({
      method: "post",
      url: "https://apod.nasa.gov/cgi-bin/apod/apod_search",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: `tquery=${keyword}`
    }).then(({ data }) => {
      const searchDom = new DOMParser();
      const searchHtml = searchDom.parseFromString(data, "text/html");
      const searches = searchHtml.querySelectorAll("p");
      const searchResult = [];

      for (let i = 0; i < MAX_CELESTIAL_DISPLAYED; i++) {
        const search = searches[i];
        if (!search) continue;

        const parse = search.querySelectorAll("a")[1];
        if (!parse) continue;

        const date = parse.textContent.match(/^\s?APOD:\s(.*?)\s-/);
        if (!date[1]) continue;

        const title = parse.textContent
          .replace(/(APOD:\s.*\s-)|(\r\n|\n|\r)/gm, "")
          .trim();

        searchResult.push({
          title,
          url: parse.href,
          date: formatDate(new Date(date[1]))
        });
      }

      cachedResults[keyword] = searchResult;
      setResults(searchResult);
    });
  }, [keyword]);

  return !results ? (
    <SunLoader />
  ) : (
    <div>
      <h2 className="title">Other APOD's containing: "{startCase(keyword)}"</h2>
      {results.map(({ title, date }, idx) => {
        return (
          <ViewItem
            key={idx}
            title={title}
            date={date}
            specificDate={specificDate}
            closeDrawer={closeDrawer}
          />
        );
      })}
    </div>
  );
}

export default SearchView;
