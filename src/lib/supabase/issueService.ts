import { supabase } from '@/src/lib/supabase/client';

export async function createIssue(issue: Record<string, unknown>): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('issues').insert(issue).select('id').single();
  return data?.id ?? null;
}

export async function updateIssue(
  issueId: string,
  updates: Record<string, unknown>,
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('issues').update(updates).eq('id', issueId);
  return !error;
}

export async function getIssues() {
  if (!supabase) return [];
  const { data } = await supabase.from('issues').select('*').order('created_at', { ascending: false });
  return data ?? [];
}
