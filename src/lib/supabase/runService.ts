import { supabase } from '@/src/lib/supabase/client';

export async function saveRun(run: {
  user_id: string;
  group_id: string;
  path: unknown;
  distance_meters: number;
  started_at: string;
  ended_at: string | null;
  status: string;
  loop_result: unknown;
}): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('runs').insert(run).select('id').single();
  return data?.id ?? null;
}

export async function getRuns(userId?: string) {
  if (!supabase) return [];
  let query = supabase.from('runs').select('*').order('created_at', { ascending: false }).limit(50);
  if (userId) query = query.eq('user_id', userId);
  const { data } = await query;
  return data ?? [];
}
