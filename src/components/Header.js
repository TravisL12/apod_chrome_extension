import React from "react";
import TopSites from "./TopSites";
import {
  adjacentDate,
  today,
  randomDate,
  prettyDateFormat
} from "../DateManager";

export default function Header({ title, date, getImage }) {
  function previous() {
    getImage(adjacentDate(date, -1));
  }

  function next() {
    getImage(adjacentDate(date, 1));
  }

  function current() {
    getImage(today);
  }

  function random() {
    getImage(randomDate());
  }

  return (
    <div className="apod__header">
      <TopSites />
      <div className="explanation">
        <div className="title">
          <h2>{prettyDateFormat(date)}</h2>
          <h1>{title}</h1>
          <span className="img-quality">HD</span>
        </div>

        <ul className="nav-buttons">
          <li onClick={current}>Today</li>
          <li onClick={random}>Random</li>
          <li onClick={previous}>Previous</li>
          <li onClick={next}>Next</li>
          <li className="add-favorite" />
          <li>Force HD</li>
        </ul>
      </div>
    </div>
  );
}
