import flatpickr from "flatpickr";

const DATE_FORMAT = "Y-m-d";

/**
 * Gives the actual date (with timezone) at midnight
 *
 * @param  {string} date
 * @return {Date}
 */
function _actualDate(date) {
  return new Date(flatpickr.parseDate(date, DATE_FORMAT));
}

function _getToday() {
  return flatpickr.formatDate(new Date(), DATE_FORMAT);
}

export default {
  get today() {
    return _getToday();
  },

  prettyDateFormat(date) {
    return _actualDate(date).toLocaleDateString("en", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  },

  adjacentDate(dateString, direction) {
    const date = _actualDate(dateString);
    let adjDate = new Date(date.getTime());

    adjDate = new Date(adjDate.setDate(adjDate.getDate() + direction));
    return flatpickr.formatDate(adjDate, DATE_FORMAT);
  },

  randomDate() {
    const start = new Date(1995, 5, 16);
    const end = new Date();
    const date = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );

    return flatpickr.formatDate(date, DATE_FORMAT);
  },

  isToday(date) {
    return new Date(_getToday()).getTime() === _actualDate(date).getTime();
  }
};
