import { createClient } from '@supabase/supabase-js';

function requireEnv(name, value) {
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

export function supabaseServer() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  requireEnv('SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)', url);
  requireEnv('SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)', anon);

  return createClient(url, service || anon, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
