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

export function titleCase(text: string) {
  if (!text) return text;
  return text[0].toUpperCase() + text.slice(1);
}

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
