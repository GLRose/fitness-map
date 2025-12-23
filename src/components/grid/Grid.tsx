import Boxes from '@/components/boxes/Boxes';
import { setDate } from '@/utils/dateRange.ts';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export interface DateItem {
  date: string;
  activity: boolean;
  level: number;
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

  const [checkBoxChecked, setCheckBoxChecked] = useState(() => {
    const saved = localStorage.getItem('checkedOption');
    console.log(saved);
    return saved || 'default';
  });

  useEffect(() => {
    localStorage.setItem('dateRange', JSON.stringify(dateRange));
    localStorage.setItem('checkedOption', checkBoxChecked);
  }, [dateRange, checkBoxChecked]);

  const handleSubmit = (event: React.FormEvent, targetDate?: string) => {
    event.preventDefault();

    const dateToMark = targetDate || format(new Date(), 'yyyy-MM-dd');

    setDateRange((prev) =>
      prev.map((item) =>
        item.date === dateToMark ? { ...item, activity: true } : item
      )
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.name;
    setCheckBoxChecked(newTheme);
    setThemeName(newTheme);
  };

  const elements = dateRange.map((item, i) => {
    const className = item.activity
      ? `${themeName || 'default'}-box-item-lvl-${item.level ?? 0}`
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
            checked={checkBoxChecked === 'default'}
            onChange={handleChange}
          />

          <p> Power Pink </p>
          <input
            type="radio"
            name="powerPink"
            checked={checkBoxChecked === 'powerPink'}
            onChange={handleChange}
          />

          <p> Growing Green </p>
          <input
            type="radio"
            name="growingGreen"
            checked={checkBoxChecked === 'growingGreen'}
            onChange={handleChange}
          />
        </div>
      </div>

      <Boxes elements={elements} />

      <form className="form" onSubmit={handleSubmit}>
        <button type="submit" className="submit-form">
          Log Activity
        </button>
      </form>
    </>
  );
}
