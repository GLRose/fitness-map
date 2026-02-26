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
      <div
        className="text-base font-semibold mb-1 cursor-pointer text-foreground hover:text-primary transition-colors"
        onClick={onEdit}
      >
        {workoutTitle?.toUpperCase() || 'Untitled Workout'}
      </div>

      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-2">Activity Description:</div>

      <div
        className="text-sm mb-1 cursor-pointer text-foreground/80 hover:text-foreground transition-colors"
        onClick={onEdit}
      >
        {activityText || 'Untitled Activity'}
      </div>

      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-2">Url:</div>

      <a href={url} className="text-sm truncate text-primary hover:underline block">
        {url}
      </a>

      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-2">Completed On:</div>

      <div className="text-sm">
        {currentDate && (
          <span className="text-xs text-muted-foreground mt-1 block">
            {currentDate}
          </span>
        )}
      </div>
    </>
  );
}
