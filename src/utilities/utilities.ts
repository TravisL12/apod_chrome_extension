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
