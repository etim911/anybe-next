import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekdxtohgrlzugluzmqpb.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key_for_build'

// Create client - will fail at runtime if key is empty, but won't crash build
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)
