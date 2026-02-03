import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://dxmttvtrjnrumqmmunoc.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

//Pulling from supabase psql db
let { data: activity, error } = await supabase.from('activity').select('date');

console.log(`Activity is: ${JSON.stringify(activity)}, with error ${error} `);
