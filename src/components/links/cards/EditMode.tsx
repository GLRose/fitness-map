import { Text, Link } from '@radix-ui/themes';

interface EditProps {
  workoutTitle: string;
  activityText: string;
  url: string;
  currentDate: string;
  onEdit: () => void;
}

export default function EditMode({
  workoutTitle,
  activityText,
  url,
  currentDate,
  onEdit,
}: EditProps) {
  return (
    <>
      <Text
        as="div"
        size="5"
        weight="bold"
        style={{ marginBottom: '5px', cursor: 'pointer' }}
        onClick={onEdit}
      >
        {workoutTitle?.toUpperCase() || 'Untitled Workout'}
      </Text>

      <Text as="div" size="2" weight="bold">
        Activity Description:
      </Text>

      <Text
        as="div"
        size="2"
        weight="regular"
        style={{ marginBottom: '5px', cursor: 'pointer' }}
        onClick={onEdit}
      >
        {activityText || 'Untitled Activity'}
      </Text>

      <Text as="div" size="2" weight="bold">
        Url:
      </Text>

      <Link href={url} size="2" truncate>
        {url}
      </Link>

      <Text as="div" size="2" weight="bold">
        Completed On:
      </Text>

      <Text as="div" size="2">
        {currentDate}
      </Text>
    </>
  );
}
