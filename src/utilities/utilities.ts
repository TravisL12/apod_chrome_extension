// Zero pad dates
export function zeroPad(num: string) {
  num = `0${num.toString()}`;
  return num.slice(-2);
}

export function titleCase(text: string) {
  if (!text) return text;
  return text[0].toUpperCase() + text.slice(1);
}
