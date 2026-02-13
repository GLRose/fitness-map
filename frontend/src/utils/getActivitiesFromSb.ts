import { createClient } from '@supabase/supabase-js';

//Pull activities from supabase psql table
export async function getActivities() {
  const supabaseUrl = 'https://dxmttvtrjnrumqmmunoc.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey || '');

  const { data: activity, error } = await supabase.from('activity').select();

  if (error) {
    console.error('Error fetching data:', error.message);
    return;
  }

  console.log(`Activity is: ${JSON.stringify(activity)}`);

  return activity;
}

interface ActivityRow {
  activity: boolean;
  date: string;
  level: string;
}

export async function upsertActivityForUser(activityData: ActivityRow) {
  const supabaseUrl = 'https://dxmttvtrjnrumqmmunoc.supabase.co'; // Use your actual URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey || '');

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
