import Boxes from '@/components/boxes/Boxes';
import { format, addDays, parse } from 'date-fns';
// import { getActivities } from '@/utils/getActivities';
// import { getSB } from '@/utils/getActivitiesFromSb';
import { setDate } from '@/utils/dateRange.ts';
import { Text } from '@radix-ui/themes';
import { useState, useEffect } from 'react';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DateItem {
  date: string;
  activity: boolean;
  theme?: string;
  level?: string;
}

export default function Grid() {
  // getSB();
  const [dateRange, setDateRange] = useState<DateItem[]>(() => {
    const saved = localStorage.getItem('dateRange');
    return saved ? JSON.parse(saved) : setDate();
  });

  const [themeName, setThemeName] = useState(() => {
    const saved = localStorage.getItem('checkedOption');
    return saved || 'default';
  });

  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(
    () => {
      const saved =
        (localStorage.getItem('difficultyOption') as DifficultyLevel) ?? 'easy';
      return saved;
    }
  );

  useEffect(() => {
    localStorage.setItem('dateRange', JSON.stringify(dateRange));
    localStorage.setItem('checkedOption', themeName);
    localStorage.setItem('difficultyOption', difficultyLevel);
  }, [dateRange, themeName, difficultyLevel]);

  const handleSubmit = (event: React.FormEvent, targetDate?: string) => {
    event.preventDefault();
    const dateToMark = targetDate || format(new Date(), 'yyyy-MM-dd');
    //For testing days ahead...
    // const dateToMark =
    //   targetDate || format(addDays(new Date(), 3), 'yyyy-MM-dd');
    // const selectedLevel = difficultyLevel;
    // console.log('selected level', selectedLevel);

    setDateRange((prev) => {
      // Check if date exists in range
      const dateExists = prev.some((item) => item.date === dateToMark);

      if (!dateExists) {
        // Add the missing date(s) to the array
        const lastDate = prev[prev.length - 1]?.date;
        if (lastDate) {
          const newDates: DateItem[] = [...prev];
          let currentDate = addDays(
            parse(lastDate, 'yyyy-MM-dd', new Date()),
            1
          );
          const targetDateParsed = parse(dateToMark, 'yyyy-MM-dd', new Date());

          // Add all dates from last date to target date
          while (currentDate <= targetDateParsed) {
            newDates.push({
              date: format(currentDate, 'yyyy-MM-dd'),
              activity: false,
              // level: difficultyLevel,
            });
            currentDate = addDays(currentDate, 1);
          }

          // Mark the target date as active
          return newDates.map((item) =>
            item.date === dateToMark
              ? { ...item, activity: true, level: difficultyLevel }
              : item
          );
        }
      }

      // Date exists, just mark it active
      return prev.map((item) =>
        item.date === dateToMark
          ? { ...item, activity: true, level: difficultyLevel }
          : item
      );
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.name;
    setThemeName(newTheme);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as DifficultyLevel;
    console.log('Difficulty Level', value);
    setDifficultyLevel(value);
  };

  const activeDaysCount = dateRange.reduce(
    (acc, item) => acc + (item.activity ? 1 : 0),
    0
  );

  const elements = dateRange.map((item, i) => {
    const effectiveLevel = item.level || 'easy';
    const className = item.activity
      ? `${themeName || 'default'}-box-item-lvl-${effectiveLevel}`
      : 'box-item';

    const dayLetter: string = [
      'Sun',
      'M',
      'T',
      'W',
      'Th',
      'F',
      'Sat',
    ][new Date(item.date).getDay()];

    return (
      <div key={i} className={className}>
        {i < 7 && (
          <Text weight="bold" size="3" color="cyan">
            {dayLetter}
          </Text>
        )}
      </div>
    );
  });

  return (
    <>
      <div className="theme-names-container">
        <div className="theme-names">
          <div className="theme-names-shadow">
            <h2>Theme:&nbsp;</h2>

            <Text as="div" size="5">
              Default
            </Text>
            <input
              type="radio"
              name="default"
              checked={themeName === 'default'}
              onChange={handleChange}
            />

            <Text as="div" size="5">
              Pink
            </Text>
            <input
              type="radio"
              name="powerPink"
              checked={themeName === 'powerPink'}
              onChange={handleChange}
            />

            <Text as="div" size="5">
              Green
            </Text>
            <input
              type="radio"
              name="growingGreen"
              checked={themeName === 'growingGreen'}
              onChange={handleChange}
            />
            <div>&nbsp;</div>
          </div>
        </div>
      </div>
      <Boxes elements={elements} />
      <form className="form" onSubmit={handleSubmit}>
        <div className="log-activity-submit">
          <button type="submit" className="submit-form">
            Log Activity
          </button>
        </div>
        <h2>Difficulty:&nbsp;</h2>

        <Text as="div" size="5">
          Easy
        </Text>

        <input
          type="radio"
          name="difficulty"
          onChange={handleDifficultyChange}
          value="easy"
          checked={difficultyLevel === 'easy'}
        />

        <Text as="div" size="5">
          Medium
        </Text>
        <input
          type="radio"
          name="difficulty"
          onChange={handleDifficultyChange}
          value="medium"
          checked={difficultyLevel === 'medium'}
        />
        <Text as="div" size="5">
          Hard
        </Text>
        <input
          type="radio"
          name="difficulty"
          onChange={handleDifficultyChange}
          value="hard"
          checked={difficultyLevel === 'hard'}
        />
        <div>
          <Text
            as="p"
            style={{ color: 'pink', paddingLeft: '10px' }}
            highContrast
            wrap="nowrap"
            weight="bold"
            size="5"
          >
            DAYS WORKED OUT: {activeDaysCount}
          </Text>
        </div>
      </form>
    </>
  );
}
