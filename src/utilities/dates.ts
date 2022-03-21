const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export function adjacentDate(dateString: string, direction: number): string {
  console.log(dateString, 'dateString');

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
