/* Randomizer */
export function randomizer(max, min) {
  min = min || 0;
  max = max || 1;

  return Math.round(Math.random() * (max - min) + min);
}

/* Zero pad dates */
export function zeroPad(num) {
  num = '0' + num.toString();
  return num.slice(-2);
}

/* Query selector shortcut (mimic jQuery) */
export function $(el) {
  return document.querySelector(el);
}

/* Alternative to innerHTML */
export function htmlToElements(html) {
  var template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstChild;
}
