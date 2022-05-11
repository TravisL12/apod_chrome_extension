// Zero pad dates
export function zeroPad(num: string) {
  num = `0${num.toString()}`;
  return num.slice(-2);
}

export function isEmpty(obj: any[] | { [key: string]: any }) {
  if (Array.isArray(obj)) {
    return obj.length === 0;
  }

  return Object.keys(obj).length === 0;
}

export function randomizer(max: number = 1, min: number = 0) {
  return Math.round(Math.random() * (max - min) + min);
}
