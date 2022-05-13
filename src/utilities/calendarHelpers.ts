export const YEARS = 'years';
export const MONTHS = 'months';

export const buildMaxMinDate = (dateValue?: string | Date) => {
  if (!dateValue) {
    return null;
  }
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
};

export const createDate = (year: number, month: number) => {
  const firstDay = new Date(year, month).getDay(); // 0-index day of week (0 - 6)
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const nextMonthTotalDays = new Date(year, month + 2, 0).getDate();

  return {
    firstDay,
    totalDays,
    prevMonthTotalDays,
    nextMonthTotalDays,
  };
};

export const buildNumberArray = (days: number) =>
  Array.from(Array(days).keys()).map((day) => day);

export const months = buildNumberArray(12).map((month) => {
  const date = new Date(2021, month);
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
  });
});

export const daysOfWeek = buildNumberArray(7).map((day) => {
  const date = new Date(2021, 1, day);
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
  });
});
