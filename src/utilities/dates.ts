import { MIN_APOD_DATE } from '../constants';
import { zeroPad } from './utilities';

export const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export function adjacentDate(dateString: string, direction: number): string {
  const adjDate = new Date(dateString);

  const latest = new Date(
    adjDate.getFullYear(),
    adjDate.getMonth(),
    adjDate.getDate() + direction
  );

  return formatDate(latest);
}

export const prettyDateFormat = (date: string): string => {
  return new Date(date.replace('-', '/')).toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// https://apod.nasa.gov/apod/ap220321.html (generate `220321`)
export const linkDateFormat = (date: string) => {
  const dateStr = date.split('-');
  return `${dateStr[0].slice(-2)}${zeroPad(dateStr[1])}${zeroPad(dateStr[2])}`;
};

export const isDateToday = (date: string): boolean => {
  if (!date) {
    return false;
  }

  const isGreater = new Date(date) > getToday();
  return formatDate(getToday()) === date || isGreater;
};

export const isFirstApodDate = (date?: string): boolean => {
  if (!date) {
    return false;
  }

  const isLess = new Date(date) < new Date(MIN_APOD_DATE);
  return MIN_APOD_DATE === date || isLess;
};

export const getToday = () => {
  return new Date();
};
