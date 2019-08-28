import React, { useState, useEffect } from "react";
import reqwest from "reqwest";
import { first } from "lodash";

import { prettyDateFormat, formatDate } from "../../DateManager";
import { thumbSourceLink } from "../../utilities";
import { SunLoader } from "../LoadingSpinner";

const MAX_CELESTIAL_DISPLAYED = 20;
const cachedResults = {};

function KnowMoreTab({ keyword, specificDate, closeDrawer }) {
  const [results, setResults] = useState(null);

  useEffect(() => {
    setResults(null);

    if (cachedResults[keyword]) {
      setResults(cachedResults[keyword]);
      return;
    }

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
        if (!search) continue;

        const parse = search.querySelectorAll("a")[1];
        if (!parse) continue;

        const date = first(parse.textContent.match(/(?<=APOD:\s).*(?=\s-)/));
        if (!date) continue;

        const title = parse.textContent
          .replace(/(APOD:\s.*\s-)|(\r\n|\n|\r)/gm, "")
          .trim(); // remove line breaks Regex

        searchResult.push({
          title,
          url: parse.href,
          date: formatDate(new Date(date))
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
      <h2 className="title">Other APOD's containing: "{keyword}"</h2>
      {results.map((result, idx) => {
        const imgSrc = thumbSourceLink(result.date);

        return (
          <div
            className="similar-apod"
            key={idx}
            onClick={() => {
              specificDate(result.date);
              closeDrawer();
            }}
          >
            <div className="similar-apod-thumb">
              <img alt="Thumb" src={imgSrc} />
            </div>
            <div className="similar-apod-title">
              <p>{prettyDateFormat(result.date)}</p>
              <p>{result.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KnowMoreTab;
