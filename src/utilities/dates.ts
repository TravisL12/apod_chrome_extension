import { APOD_TIME_ZONE, MIN_APOD_DATE } from '../constants';
import { zeroPad } from './utilities';

export const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const splitDateString = (dateString: string) => dateString.split('-');

export function adjacentDate(dateString: string, direction: number): string {
  const [year, month, day] = splitDateString(dateString);
  const adjDate = new Date(+year, +month - 1, +day);

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

// Dates are stored unpadded (`2024-1-14`), which sorts wrong in a file
// listing; downloaded filenames use the padded form instead.
export const isoDateFormat = (dateString: string) => {
  const [year, month, day] = splitDateString(dateString);
  return `${year}-${zeroPad(month)}-${zeroPad(day)}`;
};

// https://apod.nasa.gov/apod/ap220321.html (generate `220321`)
export const linkDateFormat = (dateString: string) => {
  const [year, month, day] = splitDateString(dateString);
  return `${year.slice(-2)}${zeroPad(month)}${zeroPad(day)}`;
};

export const isDateToday = (date: string): boolean => {
  if (!date) {
    return false;
  }

  const today = getToday();
  return formatDate(today) === date || new Date(date) > today;
};

export const isFirstApodDate = (date?: string): boolean => {
  if (!date) {
    return false;
  }

  const isLess = new Date(date) < new Date(MIN_APOD_DATE);
  return MIN_APOD_DATE === date || isLess;
};

/**
 * The APOD calendar rolls over on US Eastern time. Using the viewer's local
 * date instead means anyone east of ET sees a "today" NASA has not published
 * yet, which renders a Next arrow that 404s.
 */
export const getToday = (): Date => {
  const [month, day, year] = new Intl.DateTimeFormat('en-US', {
    timeZone: APOD_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
    .format(new Date())
    .split('/');

  return new Date(+year, +month - 1, +day);
};
