import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getYouTubeThumbnail } from '@/utils/getYoutubeThumbnail';
import EditMode from './EditMode';
import { format, isValid } from 'date-fns';
import type { LinkRow } from '@/utils/supabase/interfaces';

interface LinksCardProps {
  data: LinkRow;
  onAdd: (title: string, activityDescription: string) => void;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function LinksCard({ data, onAdd, onDelete }: LinksCardProps) {
  const { url, workoutTitle, activityText, date } = data;
  const [isEditing, setIsEditing] = useState(!workoutTitle);
  const [inputValue, setInputValue] = useState(workoutTitle);
  const [activityDescription, setActivityDescription] = useState(activityText);
  const parsedDate = new Date(date);
  const formattedDate = isValid(parsedDate) ? format(date, 'MMM dd, yyyy') : '';

  const handleSubmit = () => {
    onAdd(inputValue, activityDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(workoutTitle);
    setIsEditing(false);
  };

  const thumbnail = getYouTubeThumbnail(url);

  return (
    <div className="max-w-[500px]">
      <Card className="h-[500px] relative">
        <Button
          variant="destructive"
          size="icon"
          onClick={onDelete}
          className="absolute top-3 right-3"
        >
          <Trash2 className="cursor-pointer" />
        </Button>

        <CardContent className="flex gap-3 items-center pt-0">
          <div className="w-full">
            {!isEditing ? (
              <EditMode
                workoutTitle={workoutTitle}
                activityText={activityText}
                url={url}
                currentDate={formattedDate}
                onEdit={() => setIsEditing(true)}
              />
            ) : (
              <div className="flex gap-2 flex-col mb-[50px]">
                <Input
                  value={inputValue}
                  placeholder="Title your workout"
                  onChange={(e) => setInputValue(e.target.value)}
                />

                <Input
                  value={activityDescription}
                  placeholder="Activity Description"
                  onChange={(e) => setActivityDescription(e.target.value)}
                />

                <div className="flex gap-2">
                  <Button type="button" onClick={handleSubmit}>
                    Save
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {thumbnail && (
              <a href={url}>
                <img
                  src={thumbnail}
                  alt="Video thumbnail"
                  className="w-full rounded-lg mt-5"
                />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
