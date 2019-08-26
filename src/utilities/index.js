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

// export function thumbSourceLink(params) {
// https://apod.nasa.gov/apod/calendar/S_011007.jpg
// Filename is S_YYMMDD.jpg
// }

export function apodSourceLink(date) {
  if (!date) return;

  const dateStr = date.split("-");
  return `ap${dateStr[0].slice(-2)}${zeroPad(dateStr[1])}${zeroPad(
    dateStr[2]
  )}.html`;
}
