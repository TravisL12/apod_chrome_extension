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
        <div className="no-favorites">
          <p>You don't have any favorites yet!</p>
          <p>Click the "Save Favorite" button at the top right of the page!</p>
        </div>
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
