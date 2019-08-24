/*global chrome*/
import React from "react";
import { isEmpty, keys } from "lodash";
import { prettyDateFormat } from "../../DateManager";

function FavoritesTab({ favorites, specificDate }) {
  function deleteFavorite(date) {
    const updatedFavorites = { ...favorites };
    delete updatedFavorites[date];

    chrome.storage.sync.set({
      apodFavorites: updatedFavorites
    });
  }

  return (
    <div class="favorites">
      <h2>Favorite APOD's</h2>
      {isEmpty(favorites) ? (
        <li class="no-favorites">
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
              <li class="favorite" key={idx}>
                <div onClick={() => specificDate(date)} class="favorite__image">
                  <div
                    class="favorite__image-image"
                    style={{ backgroundImage: `url(${favorite.imgUrl})` }}
                  />
                </div>
                <div onClick={() => specificDate(date)} class="favorite__title">
                  <p class="favorite__title-date">{prettyDateFormat(date)}</p>
                  <p class="favorite__title-title">{favorite.title}</p>
                </div>
                <div
                  onClick={() => deleteFavorite(date)}
                  class="remove-favorite"
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
