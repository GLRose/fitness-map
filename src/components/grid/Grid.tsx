import Boxes from '@/components/boxes/Boxes';
import { setDate } from '@/utils/dateRange.ts';
import { useState, useEffect } from 'react';
import { format, addDays, parse } from 'date-fns';
import { Text } from '@radix-ui/themes';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DateItem {
  date: string;
  activity: boolean;
  level: DifficultyLevel;
  theme?: string;
}

export default function Grid() {
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

  //Simplify this process a bit more
  const handleSubmit = (
    event: React.FormEvent,
    targetDate?: string,
    level?: DifficultyLevel
  ) => {
    event.preventDefault();
    const dateToMark = targetDate || format(new Date(), 'yyyy-MM-dd');
    const selectedLevel = level ?? difficultyLevel;

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
              level: selectedLevel,
            });
            currentDate = addDays(currentDate, 1);
          }

          // Mark the target date as active
          return newDates.map((item) =>
            item.date === dateToMark ? { ...item, activity: true } : item
          );
        }
      }

      // Date exists, just mark it active
      return prev.map((item) =>
        item.date === dateToMark ? { ...item, activity: true } : item
      );
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.name;
    setThemeName(newTheme);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as DifficultyLevel;
    console.log(value);
    setDifficultyLevel(value);
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  const elements = dateRange.map((item, i) => {
    const effectiveLevel =
      item.date === today && item.activity ? difficultyLevel : item.level;

    const className = item.activity
      ? `${themeName || 'default'}-box-item-lvl-${effectiveLevel}`
      : 'box-item';

    return <div key={i} className={className}></div>;
  });

  return (
    <>
      <div className="theme-names-container">
        <div className="theme-names">
          <p>Default</p>
          <input
            type="radio"
            name="default"
            checked={themeName === 'default'}
            onChange={handleChange}
          />

          <p> Power Pink </p>
          <input
            type="radio"
            name="powerPink"
            checked={themeName === 'powerPink'}
            onChange={handleChange}
          />

          <p> Growing Green </p>
          <input
            type="radio"
            name="growingGreen"
            checked={themeName === 'growingGreen'}
            onChange={handleChange}
          />
        </div>
      </div>

      <Boxes elements={elements} />

      <form className="form" onSubmit={handleSubmit}>
        <button type="submit" className="submit-form">
          Log Activity
        </button>
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
      </form>
    </>
  );
}
