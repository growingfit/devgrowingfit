import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from './server';

/**
 * Creates an elevated Supabase client for Server Actions.
 * If SUPABASE_SERVICE_ROLE_KEY is set, it uses it to bypass RLS for verified admins.
 * Otherwise, it uses the authenticated session client.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (serviceKey && supabaseUrl) {
    return createSupabaseClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  // Fallback to authenticated server client with session cookies
  return createServerClient();
}
