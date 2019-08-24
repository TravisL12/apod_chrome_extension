import React from "react";
import TopSites from "./TopSites";
import { prettyDateFormat } from "../DateManager";

function Header({ response: { title, date }, isImageHD, dateNavigation }) {
  const {
    previous,
    next,
    current,
    random,
    forceHighDef,
    saveFavorite
  } = dateNavigation;

  return (
    <div className="apod__header">
      <TopSites />
      <div className="explanation">
        <div className="title">
          <h2>{prettyDateFormat(date)}</h2>
          <h1>{title}</h1>
          <span className="img-quality">{isImageHD ? "HD" : "SD"}</span>
        </div>

        <ul className="nav-buttons">
          <li onClick={current}>Today</li>
          <li onClick={random}>Random</li>
          <li onClick={previous}>Previous</li>
          <li onClick={next}>Next</li>
          <li onClick={saveFavorite} className="add-favorite">
            Save
          </li>
          <li onClick={forceHighDef}>Force HD</li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
