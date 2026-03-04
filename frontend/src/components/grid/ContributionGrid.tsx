// Manual DB
// import { getActivities } from '@/utils/getActivities';
import Boxes from '@/components/boxes/ContributionBoxes';
import { format, addDays, parse } from 'date-fns';
import Logout from '@/components/login/Logout';
import { setDate } from '@/utils/dateRange.ts';
import { useState, useEffect } from 'react';
// Supabasae
import { getActivities, upsertActivityForUser } from '@/utils/supabase/sbCrud';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DateItem {
  date: string;
  activity: boolean;
  theme?: string;
  level?: string;
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

  useEffect(() => {
    async function loadData() {
      const activities = await getActivities();

      if (activities) {
        setDateRange((currentGrid) =>
          currentGrid.map((day) => {
            // Find if there is an activity that matches this day's date
            const matchingActivity = activities.find(
              (a: DateItem) => a.date === day.date // Ensure your column names match
            );

            // If found, merge the activity data into the day object
            return matchingActivity
              ? { ...day, ...matchingActivity, hasActivity: true }
              : day;
          })
        );
      }
    }

    loadData();
  }, []);

  const handleSubmit = async (event: React.FormEvent, targetDate?: string) => {
    event.preventDefault();
    const dateToMark = targetDate || format(new Date(), 'yyyy-MM-dd');

    setDateRange((prev) => {
      const idx = prev.findIndex((item) => item.date === dateToMark);
      if (idx >= 0) {
        return prev.map((item, i) =>
          i === idx
            ? { ...item, activity: true, level: difficultyLevel }
            : item
        );
      }
      const lastDate = prev[prev.length - 1]?.date;
      if (!lastDate) return prev;

      const targetDateParsed = parse(dateToMark, 'yyyy-MM-dd', new Date());
      let currentDate = addDays(
        parse(lastDate, 'yyyy-MM-dd', new Date()),
        1
      );
      const newSegment: DateItem[] = [];
      while (currentDate <= targetDateParsed) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        newSegment.push({
          date: dateStr,
          activity: dateStr === dateToMark,
          ...(dateStr === dateToMark && { level: difficultyLevel }),
        });
        currentDate = addDays(currentDate, 1);
      }
      return [...prev, ...newSegment];
    });

    try {
      await upsertActivityForUser({
        activity: true,
        date: dateToMark,
        level: difficultyLevel,
      });
    } catch (error) {
      console.error('Database sync failed', error);
      setDateRange((prev) =>
        prev.map((item) =>
          item.date === dateToMark
            ? { ...item, activity: false, level: undefined }
            : item
        )
      );
    }
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

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayLogged = dateRange.some(
    (item) => item.date === todayStr && item.activity
  );

  const elements = dateRange.map((item, i) => {
    const effectiveLevel = item.level || 'easy';
    const className = item.activity
      ? `${themeName || 'default'}-box-item-lvl-${effectiveLevel}`
      : 'box-item';

    const dayLetter: string = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][
      new Date(item.date).getDay()
    ];

    return (
      <div key={i} className={className}>
        {i < 7 && (
          <span className="text-xs font-semibold text-foreground/70">
            {dayLetter}
          </span>
        )}
      </div>
    );
  });

  const themes = [
    { name: 'default', label: 'Default' },
    { name: 'powerPink', label: 'Pink' },
    { name: 'growingGreen', label: 'Green' },
  ] as const;

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ] as const;

  return (
    <>
      {/* Top bar: logo + logout */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1
          className="text-5xl leading-none text-primary"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Log It!
        </h1>
        <Logout />
      </div>

      {/* Theme selector */}
      <div className="flex justify-center px-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mr-1">
            Theme
          </span>
          {themes.map(({ name, label }) => (
            <label
              key={name}
              className={`cursor-pointer select-none px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                themeName === name
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <input
                type="radio"
                name={name}
                checked={themeName === name}
                onChange={handleChange}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <Boxes elements={elements} />

      {/* Log action panel */}
      <form
        className="flex flex-col items-center w-full max-w-xs mx-auto mt-8 mb-6 px-4 gap-3"
        onSubmit={handleSubmit}
      >
        {/* Difficulty pills — directly above the button to show intent */}
        <div className="flex flex-col items-center gap-2 w-full">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Difficulty
          </span>
          <div className="flex gap-2">
            {difficulties.map(({ value, label }) => (
              <label
                key={value}
                className={`select-none px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  todayLogged
                    ? 'cursor-not-allowed opacity-60'
                    : 'cursor-pointer'
                } ${
                  difficultyLevel === value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={value}
                  checked={difficultyLevel === value}
                  onChange={handleDifficultyChange}
                  className="sr-only"
                  disabled={todayLogged}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={todayLogged}
          className="w-full h-14 rounded-xl text-xl font-semibold bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:active:scale-100"
        >
          {todayLogged ? 'Logged for today' : 'Log Activity'}
        </button>

        <p className="text-sm font-semibold text-primary text-center">
          {activeDaysCount} / 365 days
        </p>
      </form>
    </>
  );
}
