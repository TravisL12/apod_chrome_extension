// Zero pad dates
export function zeroPad(num: string) {
  num = `0${num.toString()}`;
  return num.slice(-2);
}
