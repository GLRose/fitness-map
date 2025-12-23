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

  // Testing values directly
  // dateRange[0].activity = true;
  // dateRange[0].level = 0;
  // dateRange[1].activity = true;
  // dateRange[56].activity = true;
  // dateRange[56].level = 1;
  // dateRange[109].activity = true;
  // dateRange[109].level = 2;
  // dateRange[340].activity = true;

  // let today = dateRange.length - 1;
  // dateRange[today].activity = true;
  return dateRange;
}
