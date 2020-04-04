/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import axios from "axios";

import ViewItem from "./ViewItem";
import { SunLoader } from "../LoadingSpinner";
import { APOD_SEARCH_URL } from "../../utilities";

const cachedResults = {};

function checkCachedResults(keyword) {
  return cachedResults[keyword.toLowerCase()];
}

const fetchApod = (keyword, setResults) => {
  setResults(undefined); // set loading view

  const cachedResult = checkCachedResults(keyword);
  if (keyword && cachedResult) {
    setResults(cachedResult);
    return;
  }

  const params = {
    search_query: keyword,
    number: 50,
  };

  axios.get(APOD_SEARCH_URL, { params }).then(({ data }) => {
    cachedResults[keyword.toLowerCase()] = data;
    setResults(data);
  });
};

function SearchView({ specificDate, closeDrawer, setSearchKeyword, keyword }) {
  const [results, setResults] = useState(undefined);

  useEffect(() => {
    if (!keyword) {
      setResults([]); // prevents an infinite loading state
      return;
    }

    const cachedResult = checkCachedResults(keyword);
    if (cachedResult) {
      setResults(cachedResult);
      return;
    }

    fetchApod(keyword, setResults);
  }, []);

  return (
    <div className="search-view">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          fetchApod(keyword, setResults);
        }}
      >
        <input
          type="text"
          value={keyword}
          placeholder={"Search the Heavens!"}
          onChange={({ target }) => setSearchKeyword(target.value)}
        />
        <button type="submit">
          <span role="img" aria-labelledby="Magnifying glass icon">
            &#x1F50E;
          </span>
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
