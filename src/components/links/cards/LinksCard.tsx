import { useState } from 'react';
import {
  Box,
  IconButton,
  Card,
  Flex,
  TextField,
  Button,
} from '@radix-ui/themes';
import { TrashIcon } from '@radix-ui/react-icons';
import { getYouTubeThumbnail } from '@/utils/getYoutubeThumbnail';
import EditMode from './EditMode';
import { format, isValid } from 'date-fns';

export interface WorkoutDetails {
  url: string;
  workoutTitle: string;
  activityText: string;
  date: string;
}

interface LinksCardProps {
  data: WorkoutDetails;
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
    if (!inputValue.trim() || !activityDescription.trim()) return;
    onAdd(inputValue, activityDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(workoutTitle);
    setIsEditing(false);
  };

  const thumbnail = getYouTubeThumbnail(url);

  return (
    <Box maxWidth="500px">
      <Card size="5" style={{ height: '500px', position: 'relative' }}>
        <IconButton
          variant="solid"
          color="tomato"
          onClick={onDelete}
          style={{ position: 'absolute', top: '12px', right: '12px' }}
        >
          <TrashIcon />
        </IconButton>

        <Flex gap="3" align="center">
          <Box style={{ width: '100%' }}>
            {!isEditing ? (
              <EditMode
                workoutTitle={workoutTitle}
                activityText={activityText}
                url={url}
                currentDate={formattedDate}
                onEdit={() => setIsEditing(true)}
              />
            ) : (
              <Flex gap="2" direction="column" style={{ marginBottom: '50px' }}>
                <TextField.Root
                  value={inputValue}
                  size="2"
                  placeholder="Title your workout"
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                />

                <TextField.Root
                  value={activityDescription}
                  size="2"
                  placeholder="Activity Description"
                  onChange={(e) => setActivityDescription(e.target.value)}
                  autoFocus
                />

                <Flex gap="2">
                  <Button type="button" onClick={handleSubmit}>
                    Save
                  </Button>
                  <Button type="button" variant="soft" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Flex>
              </Flex>
            )}

            {thumbnail && (
              <a href={url}>
                <img
                  src={thumbnail}
                  alt="Video thumbnail"
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    marginTop: '20px',
                  }}
                />
              </a>
            )}
          </Box>
        </Flex>
      </Card>
    </Box>
  );
}
