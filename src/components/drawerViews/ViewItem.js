import React from "react";
import { prettyDateFormat } from "../../utilities/dateUtility";
import { thumbSourceLink } from "../../utilities";

function DrawerViewItem({
  title,
  date,
  specificDate,
  closeDrawer,
  deleteFavorite
}) {
  const executeDeleteFavorites = event => {
    event.stopPropagation();
    deleteFavorite(date);
  };
  return (
    <div
      className="drawer-view"
      onClick={() => {
        specificDate(date);
        closeDrawer();
      }}
    >
      <div className="drawer-view-thumb">
        <img alt="Thumb" src={thumbSourceLink(date)} />
      </div>
      <div className="drawer-view-title">
        <p>{prettyDateFormat(date)}</p>
        <p>{title}</p>
      </div>
      {deleteFavorite && (
        <div onClick={executeDeleteFavorites} className="remove-favorite">
          Remove
        </div>
      )}
    </div>
  );
}

export default DrawerViewItem;
