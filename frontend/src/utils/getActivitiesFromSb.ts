import { createClient } from '@supabase/supabase-js';

export async function getActivities() {
  const supabaseUrl = 'https://dxmttvtrjnrumqmmunoc.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey || '');

  const { data: activity, error } = await supabase
    .from('activity')
    .select('date');

  if (error) {
    console.error('Error fetching data:', error.message);
    return;
  }

  console.log(`Activity is: ${JSON.stringify(activity)}`);
}

export async function insertActivityForUser() {
  const supabaseUrl = 'https://dxmttvtrjnrumqmmunoc.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey || '');

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user logged in');
    return;
  }

  // Insert new activity row with user's UUID
  const { data, error } = await supabase
    .from('activity')
    .insert({
      date: '2026-02-11',
      activity: true,
      uuid: user.id, // Logged-in user's UUID
    })
    .select();

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Inserted activity for user:', data);
  }
}
