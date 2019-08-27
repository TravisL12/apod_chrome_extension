import React, { useState, useEffect } from "react";
import reqwest from "reqwest";

import { formatDate } from "../../DateManager";
import { thumbSourceLink } from "../../utilities";
import { SunLoader } from "../LoadingSpinner";

const MAX_CELESTIAL_DISPLAYED = 20;

function KnowMoreTab({ keyword, specificDate }) {
  const [results, setResults] = useState(null);

  useEffect(() => {
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

      setResults(searchResult);
    });
  }, [keyword]);

  return !results ? (
    <SunLoader />
  ) : (
    <div className="explanation-tab">
      {results.map((result, idx) => {
        const imgSrc = `https://apod.nasa.gov/apod/calendar/${thumbSourceLink(
          result.date
        )}`;

        return (
          <div className="similar-apod-item" key={idx}>
            <img
              alt="Thumb"
              onClick={() => specificDate(result.date)}
              src={imgSrc}
            />
            <p>{result.title}</p>
          </div>
        );
      })}
    </div>
  );
}

export default KnowMoreTab;
