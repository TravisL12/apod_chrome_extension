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
  return (
    <div
      className="similar-apod"
      onClick={() => {
        specificDate(date);
        closeDrawer();
      }}
    >
      <div className="similar-apod-thumb">
        <img alt="Thumb" src={thumbSourceLink(date)} />
      </div>
      <div className="similar-apod-title">
        <p>{prettyDateFormat(date)}</p>
        <p>{title}</p>
      </div>
      {deleteFavorite && (
        <div onClick={() => deleteFavorite(date)} className="remove-favorite">
          Remove
        </div>
      )}
    </div>
  );
}

export default DrawerViewItem;
