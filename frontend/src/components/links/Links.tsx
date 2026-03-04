import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import LinksCard from '@/components/links/cards/LinksCard';
import type { LinkRow } from '@/utils/supabase/interfaces';
import { format } from 'date-fns';
import { upsertLinksForUser, getLinks, deleteLink } from '@/utils/supabase/sbCrud';

export default function Links() {
  const [url, setUrl] = useState('');
  const [videosCollapsed, setVideosCollapsed] = useState(false);

  //TODO: just set this to an empty array when I finish moving away from localStorage
  const [links, setLinks] = useState<LinkRow[]>(() => {
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

    const newLink: LinkRow = {
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
      const upserted = await upsertLinksForUser({
        url: updatedItem.url,
        workoutTitle: title,
        activityText: activityDescription,
        date: updatedItem.date,
      });

      if (upserted?.id) {
        setLinks((prev) =>
          prev.map((l, i) => (i === index ? { ...l, id: upserted.id } : l))
        );
      }
      console.log('Database synced');
    } catch (error) {
      console.error('Failed to sync to database', error);
    }
  };

  const handleDelete = async (index: number) => {
    const link = links[index];
    setLinks((prev) => prev.filter((_, i) => i !== index));

    if (link.id) {
      try {
        await deleteLink(link.id);
      } catch (error) {
        console.error('Failed to delete from database', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 pb-8">
      <div className="w-full max-w-4xl">
        {/* Section divider + heading + collapse */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 border-t border-border opacity-40" />
          {links.length > 0 ? (
            <button
              type="button"
              onClick={() => setVideosCollapsed((c) => !c)}
              className="group flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors cursor-pointer"
            >
              Workout Videos ({links.length})
              {videosCollapsed ? (
                <ChevronDown className="size-3.5 transition-colors group-hover:text-primary" />
              ) : (
                <ChevronUp className="size-3.5 transition-colors group-hover:text-primary" />
              )}
            </button>
          ) : (
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Workout Videos
            </span>
          )}
          <div className="flex-1 border-t border-border opacity-40" />
        </div>

        {/* Add URL form */}
        <form onSubmit={onSubmit} className="w-full max-w-xs mx-auto mb-6">
          <div className="flex items-center gap-1.5 w-full">
            <input
              className="flex-1 h-10 bg-card border border-border text-foreground placeholder:text-muted-foreground px-3 rounded-lg min-w-0 text-sm outline-none focus:ring-2 focus:ring-ring/50 transition"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video url"
            />
            <button
              type="submit"
              className="flex h-10 px-4 rounded-lg text-sm font-semibold justify-center items-center bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all duration-150 cursor-pointer shrink-0"
            >
              Add
            </button>
          </div>
        </form>

        {/* Cards or empty state */}
        {links.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            No workout videos yet — paste a URL above to add one.
          </p>
        ) : videosCollapsed ? (
          <button
            type="button"
            onClick={() => setVideosCollapsed(false)}
            className="w-full py-3 rounded-lg border border-border bg-card/50 text-sm text-muted-foreground hover:text-foreground hover:bg-card/80 transition text-center"
          >
            {links.length} video{links.length !== 1 ? 's' : ''} — click to expand
          </button>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3 list-none w-full">
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
        )}
      </div>
    </div>
  );
}
