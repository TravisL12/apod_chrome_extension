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

// Query selector shortcut (mimic jQuery)
export function $(el) {
  return document.querySelector(el);
}

// Alternative to innerHTML
export function htmlToElements(html, wrap) {
  const template = document.createElement("template");
  let wrapElement = "div";
  if (typeof wrap === "string") {
    wrapElement = wrap;
  }
  template.innerHTML = wrap ? `<${wrapElement}>${html}</${wrapElement}>` : html;
  return template.content.firstElementChild;
}

export function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

export function apodSourceLink(date) {
  if (!date) return;

  const dateStr = date.split("-");
  return `ap${dateStr[0].slice(-2)}${zeroPad(dateStr[1])}${zeroPad(
    dateStr[2]
  )}.html`;
}
