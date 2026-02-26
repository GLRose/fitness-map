export interface ActivityRow {
  activity: boolean;
  date: string;
  level: string;
}

export interface LinkRow {
  id?: number;
  activityText: string;
  date: string;
  workoutTitle: string;
  url: string;
}
