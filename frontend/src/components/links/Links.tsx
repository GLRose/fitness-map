import { useState, useEffect } from 'react';
import LinksCard from '@/components/links/cards/LinksCard';
import type { WorkoutDetails } from '@/components/links/cards/LinksCard';
import { format } from 'date-fns';
import { upsertLinksForUser, getLinks } from '@/utils/supabase/sbCrud';

export default function Links() {
  const [url, setUrl] = useState('');

  //TODO: just set this to an empty array when I finish moving away from localStorage
  const [links, setLinks] = useState<WorkoutDetails[]>(() => {
    const saved = localStorage.getItem('links');
    return saved ? JSON.parse(saved) : [];
  });

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem('links', JSON.stringify(links));
  }, [links]);
  useEffect(() => {
    const loadLinks = async () => {
      try {
        const data = await getLinks();
        if (data) {
          setLinks(data);
        }
      } catch (error) {
        console.error('Error loading links:', error);
      }
    };

    loadLinks();
  }, []); // Empty dependency array means this runs once when the page loads

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

  const updateInputs = async (
    index: number,
    title: string,
    activityDescription: string
  ) => {
    const updatedLinks = [...links];
    const targetLink = updatedLinks[index];

    const updatedItem = {
      ...targetLink,
      workoutTitle: title,
      activityText: activityDescription,
      date: targetLink.date || format(new Date(), 'yyyy-MM-dd'),
    };

    updatedLinks[index] = updatedItem;
    setLinks(updatedLinks);

    try {
      await upsertLinksForUser({
        url: updatedItem.url,
        workoutTitle: title,
        activityText: activityDescription,
        date: updatedItem.date,
      });
      console.log('Database synced');
    } catch (error) {
      console.error('Failed to sync to database', error);
    }
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
          gap: '5px',
          paddingBottom: '10px',
        }}
      >
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '5px',
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
