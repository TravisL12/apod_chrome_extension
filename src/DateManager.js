import flatpickr from "flatpickr";

const DATE_FORMAT = "Y-m-d";
export const MIN_APOD_DATE = "1995-06-16";

export function formatDate(date) {
  return flatpickr.formatDate(date, DATE_FORMAT);
}

/**
 * Gives the actual date (with timezone) at midnight
 *
 * @param  {string} date
 * @return {Date}
 */
export function actualDate(date) {
  return new Date(flatpickr.parseDate(date, DATE_FORMAT));
}

export function today() {
  return flatpickr.formatDate(new Date(), DATE_FORMAT);
}

export function prettyDateFormat(date) {
  return actualDate(date).toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function adjacentDate(dateString, direction) {
  let adjDate = new Date(actualDate(dateString).getTime());

  adjDate = new Date(adjDate.setDate(adjDate.getDate() + direction));
  return flatpickr.formatDate(adjDate, DATE_FORMAT);
}

export function randomDate() {
  const start = new Date(MIN_APOD_DATE.split("-"));
  const end = new Date();
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );

  return flatpickr.formatDate(date, DATE_FORMAT);
}

export function isToday(date) {
  return actualDate(today()).getTime() === actualDate(date).getTime();
}
