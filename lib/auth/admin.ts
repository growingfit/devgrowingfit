import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getAdminUser() {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // Any authenticated user created in Supabase is granted admin dashboard access
  let adminRecord = null;
  try {
    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    adminRecord = data;
  } catch {
    // admin_users table might not be seeded or queried yet
  }

  return {
    id: user.id,
    email: user.email || '',
    role: adminRecord?.role || 'admin',
    fullName:
      adminRecord?.full_name ||
      user.user_metadata?.full_name ||
      user.email?.split('@')[0] ||
      'Administrator',
  };
}

export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    redirect('/admin/login');
  }
  return admin;
}
