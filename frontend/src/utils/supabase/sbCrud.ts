import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://dxmttvtrjnrumqmmunoc.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey || '');

//Pull activities from supabase psql table
export async function getActivities() {
  const { data: activity, error } = await supabase.from('activity').select();

  if (error) {
    console.error('Error fetching data:', error.message);
    return;
  }

  console.log(`Activity is: ${JSON.stringify(activity)}`);

  return activity;
}

export async function getLinks() {
  const { data: links, error } = await supabase.from('links').select();

  if (error) {
    console.error('Error fetching data:', error.message);
    return;
  }

  console.log(`Links are: ${JSON.stringify(links)}`);

  return links;
}

interface ActivityRow {
  activity: boolean;
  date: string;
  level: string;
}

export async function upsertActivityForUser(activityData: ActivityRow) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  if (!user) {
    console.error('No user logged in');
    return;
  }

  const { data, error } = await supabase
    .from('activity')
    .insert([
      {
        uuid: user.id,
        activity: activityData.activity,
        date: activityData.date,
        level: activityData.level,
      },
    ])
    .select();

  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('✅ Inserted:', data);
  }
}

interface LinksRow {
  activityText: string;
  date: string;
  workoutTitle: string;
  url: string;
}
export async function upsertLinksForUser(linksData: LinksRow) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  if (!user) {
    console.error('No user logged in');
    return;
  }

  const { data, error } = await supabase
    .from('links')
    .insert([
      {
        uuid: user.id,
        activityText: linksData.activityText,
        date: linksData.date,
        workoutTitle: linksData.workoutTitle,
        url: linksData.url,
      },
    ])
    .select();

  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('✅ Inserted:', data);
  }
}
