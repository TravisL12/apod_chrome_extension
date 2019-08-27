/*global chrome*/
import React from "react";
import { isEmpty, keys } from "lodash";
import { prettyDateFormat } from "../../DateManager";

function FavoritesTab({ favorites, specificDate, closeDrawer }) {
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
        <ul id="drawer-list">
          {keys(favorites).map((date, idx) => {
            const favorite = favorites[date];

            return (
              <li className="favorite" key={idx}>
                <div
                  onClick={() => {
                    specificDate(date);
                    closeDrawer();
                  }}
                  className="favorite__image"
                >
                  <div className="favorite__image-image">
                    <img alt="Favorite" src={favorite.imgUrl} />
                  </div>
                </div>
                <div
                  onClick={() => specificDate(date)}
                  className="favorite__title"
                >
                  <p className="favorite__title-date">
                    {prettyDateFormat(date)}
                  </p>
                  <p className="favorite__title-title">{favorite.title}</p>
                </div>
                <div
                  onClick={() => deleteFavorite(date)}
                  className="remove-favorite"
                >
                  Remove
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FavoritesTab;
