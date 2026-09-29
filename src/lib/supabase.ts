import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lylbvhfpuajuxrhliotb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_UxlybXCxLoBsGtERusUY_g_qevwjBtK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
