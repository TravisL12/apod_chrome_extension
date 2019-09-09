import React, { Component } from "react";
import axios from "axios";

import ViewItem from "./ViewItem";
import { formatDate } from "../../utilities/dateUtility";
import { SunLoader } from "../LoadingSpinner";

const MAX_CELESTIAL_DISPLAYED = 20;
const cachedResults = {};

class SearchView extends Component {
  state = {
    results: undefined,
    searchKeyword: this.props.keyword
  };

  componentDidMount() {
    this.checkMemo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.keyword !== this.props.keyword) {
      this.checkMemo();
    }
  }

  checkMemo = () => {
    const { keyword } = this.props;

    if (cachedResults[keyword]) {
      this.setState({
        results: cachedResults[keyword],
        searchKeyword: keyword
      });
      return;
    }

    this.fetchApod(keyword);
  };

  fetchApod = keyword => {
    this.setState({ results: undefined }); // set loading view

    axios({
      method: "POST",
      url: "https://apod.nasa.gov/cgi-bin/apod/apod_search",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: `tquery=${keyword}`
    }).then(({ data }) => {
      const searchDom = new DOMParser();
      const searchHtml = searchDom.parseFromString(data, "text/html");
      const searches = searchHtml.querySelectorAll("p");
      const results = [];

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

        results.push({
          title,
          url: parse.href,
          date: formatDate(new Date(date[1]))
        });
      }

      cachedResults[keyword] = results;
      this.setState({ results, searchKeyword: keyword });
    });
  };

  render() {
    const { specificDate, closeDrawer } = this.props;
    const { results, searchKeyword } = this.state;

    return !results ? (
      <SunLoader />
    ) : (
      <div>
        <form
          onSubmit={event => {
            event.preventDefault();
            this.fetchApod(searchKeyword);
          }}
        >
          <input
            type="text"
            value={searchKeyword}
            onChange={event =>
              this.setState({ searchKeyword: event.target.value })
            }
          />
          <button type="submit">Search!</button>
        </form>
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
}

export default SearchView;
