import { createClient } from '@supabase/supabase-js';
import type { ActivityRow, LinkRow } from './interfaces';
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

//   console.log(`Activity is: ${JSON.stringify(activity)}`);

  return activity;
}

export async function getLinks() {
  const { data: links, error } = await supabase.from('links').select();

  if (error) {
    console.error('Error fetching data:', error.message);
    return;
  }

//   console.log(`Links are: ${JSON.stringify(links)}`);

  return links;
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

export async function upsertLinksForUser(linksData: LinkRow) {
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
    return;
  }

  console.log('✅ Inserted:', data);
  return data?.[0];
}

export async function deleteLink(linkId: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error('No user logged in');
    return;
  }

  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', linkId)
    .eq('uuid', user.id);

  if (error) {
    console.error('Error deleting link:', error.message);
  }
}
