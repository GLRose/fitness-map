import Boxes from '@/components/boxes/Boxes';
import { format, addDays, parse } from 'date-fns';
import { getActivities } from '@/utils/getActivities';
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
const activityData = await getActivities();
export default function Grid() {
  const [dateRange, setDateRange] = useState<DateItem[]>(() => {
    // Generate full year of dates
    const baseDates = setDate();

    const saved = localStorage.getItem('dateRange');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse localStorage data:', e);
      }
    }

    // Then check activityData
    if (!activityData || activityData.length === 0) {
      return baseDates;
    }

    const activities = activityData;

    // Merge activity data onto the base dates
    return baseDates.map((dateItem) => {
      const savedActivity = activities.find(
        (activity: DateItem) => activity.date === dateItem.date
      );
      return savedActivity ? { ...dateItem, ...savedActivity } : dateItem;
    });
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
    const updateData = async () => {
      localStorage.setItem('dateRange', JSON.stringify(dateRange));
      localStorage.setItem('checkedOption', themeName);
      localStorage.setItem('difficultyOption', difficultyLevel);
    };

    updateData();
  }, [dateRange, themeName, difficultyLevel]);
  //end of weirdness

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

  const elements = dateRange.map((item, i) => {
    const effectiveLevel = item.level || 'easy';
    const className = item.activity
      ? `${themeName || 'default'}-box-item-lvl-${effectiveLevel}`
      : 'box-item';

    const dayLetter: string = 'SMTWTFS'[new Date(item.date).getDay()];

    return (
      <div key={i} className={className}>
        {dayLetter}
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
        <h2 className="activity-difficulty-text">Difficulty:&nbsp;</h2>

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
