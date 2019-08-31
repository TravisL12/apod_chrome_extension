/*global chrome*/
import React from "react";
import { isEmpty, keys } from "lodash";
import ViewItem from "./ViewItem";

function FavoritesView({ favorites, specificDate, closeDrawer }) {
  function deleteFavorite(date) {
    const updatedFavorites = { ...favorites };
    delete updatedFavorites[date];

    chrome.storage.sync.set({
      apodFavorites: updatedFavorites
    });
  }

  return (
    <div className="favorites">
      <h2>Favorite APOD's</h2>
      {isEmpty(favorites) ? (
        <li className="no-favorites">
          <h4>You don't have any favorites yet!</h4>
          <h4>
            Click the "Save Favorite" button at the top right of the page!
          </h4>
        </li>
      ) : (
        <div className="drawer-list">
          {keys(favorites).map((date, idx) => {
            const { title } = favorites[date];

            return (
              <ViewItem
                key={idx}
                title={title}
                date={date}
                specificDate={specificDate}
                closeDrawer={closeDrawer}
                deleteFavorite={deleteFavorite}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FavoritesView;
