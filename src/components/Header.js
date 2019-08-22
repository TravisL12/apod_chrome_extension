import React from "react";
import TopSites from "./TopSites";
import DateManager from "../DateManager";

export default function Header({ title, date }) {
  return (
    <div className="apod__header">
      <TopSites />
      <div className="explanation">
        <div className="title">
          <h2>{DateManager.prettyDateFormat(date)}</h2>
          <h1>{title}</h1>
          <span className="img-quality">HD</span>
        </div>

        <ul className="nav-buttons">
          <li className="current">Today</li>
          <li className="random">Random</li>
          <li className="previous">Previous</li>
          <li className="next">Next</li>
          <li className="add-favorite" />
          <li>Force HD</li>
        </ul>
      </div>
    </div>
  );
}
