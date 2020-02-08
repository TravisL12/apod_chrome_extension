/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import axios from "axios";

import ViewItem from "./ViewItem";
import { formatDate } from "../../utilities/dateUtility";
import { SunLoader } from "../LoadingSpinner";
import ga from "../../utilities/ga";

const cachedResults = {};

const fetchApod = (keyword, setResults) => {
  setResults(undefined); // set loading view

  axios({
    method: "POST",
    url: "https://apod.nasa.gov/cgi-bin/apod/apod_search",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: `tquery=${keyword}`
  }).then(({ data }) => {
    const domParse = new DOMParser();
    const searchHtml = domParse.parseFromString(data, "text/html");
    const searches = searchHtml.querySelectorAll("p");
    const results = [];

    for (let i = 0; i < searches.length; i++) {
      const search = searches[i];
      if (!search) continue;

      const parse = search.querySelectorAll("a")[1];
      if (!parse) continue;

      const date = parse.textContent.match(/^\s?APOD:\s(.*?)\s-/);
      if (!date || !date[1]) continue;

      const title = parse.textContent
        .replace(/(APOD:\s.*\s-)|(\r\n|\n|\r)/gm, "")
        .trim();

      results.push({
        title,
        url: parse.href,
        date: formatDate(new Date(date[1]))
      });
    }
    console.log(results);

    ga({ category: "Search", action: "request", label: keyword });
    cachedResults[keyword] = results;
    setResults(results);
  });
};

function SearchView({ specificDate, closeDrawer, setSearchKeyword, keyword }) {
  const [results, setResults] = useState(undefined);

  useEffect(() => {
    if (!keyword) {
      setResults([]); // prevents an infinite loading state
      return;
    }

    if (cachedResults[keyword]) {
      setResults(cachedResults[keyword]);
      return;
    }

    fetchApod(keyword, setResults);
  }, []);

  return (
    <div className="search-view">
      <form
        onSubmit={event => {
          event.preventDefault();
          fetchApod(keyword, setResults);
        }}
      >
        <input
          type="text"
          value={keyword}
          placeholder={"Search the Heavens!"}
          onChange={event => setSearchKeyword(event.target.value)}
        />
        <button type="submit">
          <span role="image">&#x1F50E;</span>
        </button>
      </form>
      {!results ? (
        <SunLoader />
      ) : (
        results.map(({ title, date }, idx) => {
          return (
            <ViewItem
              key={idx}
              title={title}
              date={date}
              specificDate={specificDate}
              closeDrawer={closeDrawer}
            />
          );
        })
      )}
    </div>
  );
}

export default SearchView;
