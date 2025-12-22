import Boxes from '@/components/boxes/Boxes';
import { setDate } from '@/utils/dateRange.ts';
import { useState, useEffect } from 'react';

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

  const [themeName, setThemeName] = useState('');

  const [checkBoxChecked, setCheckBoxChecked] = useState(() => {
    const saved = localStorage.getItem('checkedOption');
    console.log(saved);
    return saved || 'default';
  });

  useEffect(() => {
    localStorage.setItem('dateRange', JSON.stringify(dateRange));
    localStorage.setItem('checkedOption', checkBoxChecked);
  }, [dateRange, checkBoxChecked]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setDateRange((prev) => {
      if (prev.length === 0) return prev;

      const todayIndex = prev.length - 1;

      const updated = [...prev];
      updated[todayIndex] = {
        ...updated[todayIndex],
        activity: true,
        theme: themeName,
      };

      return updated;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target.name;
    const newTheme = e.target.checked ? target : '';

    setCheckBoxChecked(target);
    setThemeName(newTheme);
    setDateRange((prev) =>
      prev.map((item) => ({
        ...item,
        theme: newTheme,
      }))
    );
  };

  const elements = [];

  for (let i = 0; i < dateRange.length; i++) {
    const item = dateRange[i];

    const className =
      item.activity && item.theme
        ? `${item.theme}-box-item-lvl-${item.level}`
        : item.activity && item.level === 0
          ? 'default-box-item-lvl-0'
          : item.activity && item.level === 1
            ? 'default-box-item-lvl-1'
            : item.activity && item.level === 2
              ? 'default-box-item-lvl-2'
              : 'box-item';

    elements.push(<div key={i} className={className}></div>);
  }

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
