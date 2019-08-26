/* Randomizer */
export function randomizer(max, min) {
  min = min || 0;
  max = max || 1;

  return Math.round(Math.random() * (max - min) + min);
}

// Zero pad dates
export function zeroPad(num) {
  num = "0" + num.toString();
  return num.slice(-2);
}

function linkDateFormat(date) {
  const dateStr = date.split("-");
  return `${dateStr[0].slice(-2)}${zeroPad(dateStr[1])}${zeroPad(dateStr[2])}`;
}

// https://apod.nasa.gov/apod/calendar/S_011007.jpg
export function thumbSourceLink(date) {
  if (!date) return;

  return `S_${linkDateFormat(date)}.jpg`;
}

export function apodSourceLink(date) {
  if (!date) return;
  return `ap${linkDateFormat(date)}.html`;
}
