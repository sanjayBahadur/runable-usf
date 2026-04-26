import { supabase } from '@/src/lib/supabase/client';

export type ProfileRow = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  home_group_id: string | null;
  group_role: 'member' | 'executive' | null;
  points: number;
};

export async function getUserProfile(userId: string): Promise<ProfileRow | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return (data as ProfileRow) ?? null;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<ProfileRow, 'username' | 'display_name' | 'avatar_url' | 'home_group_id'>>,
): Promise<ProfileRow | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();
  return (data as ProfileRow) ?? null;
}
