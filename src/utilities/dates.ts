const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export function adjacentDate(dateString: string, direction: number): string {
  const adjDate = new Date(dateString);

  const latest = new Date(
    adjDate.getFullYear(),
    adjDate.getMonth(),
    adjDate.getDate() + direction + 1 // hmm
  );

  return formatDate(latest);
}
