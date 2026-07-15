import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_supabase_URL;
const supabaseAnonKey = import.meta.env.VITE_supabase_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing VITE_supabase_URL or          VITE_supabase_ANON_KEY in the .env.local file'
    );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
export { supabase };