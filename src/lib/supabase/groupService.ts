import { supabase } from '@/src/lib/supabase/client';

export type GroupRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  primary_color: string;
  accent_color: string;
  member_count: number;
  total_points: number;
};

export type GroupMemberRow = {
  user_id: string;
  role: 'member' | 'executive';
  display_name?: string;
  username?: string;
};

export async function getGroups(): Promise<GroupRow[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('groups').select('*').order('total_points', { ascending: false });
  return (data as GroupRow[]) ?? [];
}

export async function getGroupMembers(groupId: string): Promise<GroupMemberRow[]> {
  if (!supabase) return [];

  const { data } = await supabase
    .from('group_memberships')
    .select('user_id, role, profiles(display_name, username)')
    .eq('group_id', groupId);

  const rows = (data ?? []) as {
    user_id: string;
    role?: 'member' | 'executive';
    profiles?: { display_name?: string; username?: string } | { display_name?: string; username?: string }[];
  }[];

  return rows.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      user_id: row.user_id,
      role: row.role ?? 'member',
      display_name: profile?.display_name,
      username: profile?.username,
    };
  });
}

export async function createGroup(group: {
  name: string;
  slug: string;
  description?: string;
  primary_color: string;
  accent_color: string;
}): Promise<GroupRow | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('groups').insert(group).select().single();
  return (data as GroupRow) ?? null;
}

export async function joinGroup(userId: string, groupId: string): Promise<boolean> {
  if (!supabase) return false;

  const { error: membershipError } = await supabase
    .from('group_memberships')
    .insert({ user_id: userId, group_id: groupId });

  if (membershipError) return false;

  await supabase
    .from('profiles')
    .update({ home_group_id: groupId })
    .eq('id', userId);

  return true;
}

export async function updateGroupPoints(
  groupId: string,
  delta: number,
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.rpc('increment_group_points', {
    group_id_input: groupId,
    delta_input: delta,
  });
  return !error;
}
