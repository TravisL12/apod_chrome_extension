import flatpickr from "flatpickr";

const DATE_FORMAT = "Y-m-d";
export const MIN_APOD_DATE = "1995-06-16";

export function formatDate(date: Date): string {
  return flatpickr.formatDate(date, DATE_FORMAT);
}

export function actualDate(date: string): Date {
  return flatpickr.parseDate(date, DATE_FORMAT);
}

export function today(): string {
  return formatDate(new Date());
}

export function prettyDateFormat(date: string): string {
  return actualDate(date).toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function adjacentDate(dateString: string, direction: number): string {
  let adjDate = new Date(actualDate(dateString).getTime());

  adjDate = new Date(adjDate.setDate(adjDate.getDate() + direction));
  return formatDate(adjDate);
}

export function randomDate(): string {
  const start = actualDate(MIN_APOD_DATE);
  const end = new Date();
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );

  return formatDate(date);
}

export function isToday(date: string): boolean {
  return actualDate(today()).getTime() === actualDate(date).getTime();
}
