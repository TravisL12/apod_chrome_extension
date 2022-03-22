import { MIN_APOD_DATE } from '../constants';
import { zeroPad } from './utilities';

const formatDate = (date: Date) => {
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
  return new Date(date).toLocaleDateString('en', {
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
  const isGreater = new Date(date) > new Date();
  return formatDate(new Date()) === date || isGreater;
};

export const isFirstApodDate = (date?: string): boolean => {
  if (!date) {
    return false;
  }

  const isLess = new Date(date) < new Date(MIN_APOD_DATE);
  return MIN_APOD_DATE === date || isLess;
};
