import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://ekdxtohgrlzugluzmqpb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key_for_build';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
export const supabaseServer = supabaseAdmin;
