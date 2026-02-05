import { createClient } from '@supabase/supabase-js';

export async function getSB() {
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
