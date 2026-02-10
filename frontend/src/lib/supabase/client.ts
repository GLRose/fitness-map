import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY!;

const supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey);

export const supabase = supabaseInstance;

export const createClient = () => supabaseInstance;
