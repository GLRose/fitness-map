import { useState, useEffect } from 'react';
import LinksCard from '@/components/links/cards/LinksCard';
import type { WorkoutDetails } from '@/components/links/cards/LinksCard';
import { format } from 'date-fns';

export default function Links() {
  const [url, setUrl] = useState('');

  const [links, setLinks] = useState<WorkoutDetails[]>(() => {
    const saved = localStorage.getItem('links');
    return saved ? JSON.parse(saved) : [];
  });

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem('links', JSON.stringify(links));
  }, [links]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!url.trim()) return;

    const newLink: WorkoutDetails = {
      url: url.trim(),
      workoutTitle: '',
      activityText: '',
      date: '',
    };

    setLinks((prev) => [...prev, newLink]);
    setUrl('');
  };

  const updateInputs = (
    index: number,
    title: string,
    activityDescription: string
  ) => {
    setLinks((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        workoutTitle: title,
        activityText: activityDescription,
        date: updated[index].date || format(new Date(), 'yyyy-MM-dd'),
      };

      return updated;
    });
  };

  const handleDelete = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          paddingBottom: '10px',
        }}
      >
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            listStyle: 'none',
            justifyContent: 'center',
          }}
        >
          {links.map((link, index) => (
            <LinksCard
              key={index}
              data={link}
              onAdd={(title, activityDescription) =>
                updateInputs(index, title, activityDescription)
              }
              onDelete={() => handleDelete(index)}
            />
          ))}
        </ul>

        <form onSubmit={onSubmit}>
          <div className="link-inputs">
            <input
              style={{ backgroundColor: '#ffff', color: 'black' }}
              className="video-links"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video url"
            />
            <button type="submit" className="submit-video-link">
              Add
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
