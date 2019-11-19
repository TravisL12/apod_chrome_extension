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
  const openSpecific = () => {
    specificDate(date);
    closeDrawer();
  };

  return (
    <div className="drawer-view">
      <div className="drawer-view-thumb" onClick={openSpecific}>
        <img alt="Thumb" src={thumbSourceLink(date)} />
      </div>
      <div className="drawer-view-title" onClick={openSpecific}>
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
