import { parse, format, addDays, isBefore } from 'date-fns';

export function setDate() {
  const startDate = '2025-01-01';
  const endDate = new Date();

  let currentDate = parse(startDate, 'yyyy-MM-dd', new Date());

  const boundaryDate = endDate;

  const dateRange: Array<{ date: string; activity: boolean; level: number }> =
    [];

  while (isBefore(currentDate, boundaryDate)) {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    dateRange.push({ date: dateKey, activity: false, level: 0 });

    currentDate = addDays(currentDate, 1);
  }

  return dateRange;
}
