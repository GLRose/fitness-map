import {
  format,
  addDays,
  startOfYear,
  endOfYear,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

export interface DateType {
  date: string;
  activity: boolean;
}

type DateTypeArray = DateType[];

export function setDate() {
  const startDate = startOfYear(new Date());
  const endDate = endOfYear(new Date());

  const gridStart = startOfWeek(startDate, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endDate, { weekStartsOn: 1 });

  let dayToShow = gridStart;

  const dateRange: DateTypeArray = [];

  while (dayToShow <= gridEnd) {
    const dateKey = format(dayToShow, 'yyyy-MM-dd');
    dateRange.push({ date: dateKey, activity: false });

    dayToShow = addDays(dayToShow, 1);
  }

  return dateRange;
}
