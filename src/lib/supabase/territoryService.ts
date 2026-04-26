import { supabase } from '@/src/lib/supabase/client';

export async function saveClaim(claim: Record<string, unknown>): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('territory_claims').insert(claim).select('id').single();
  return data?.id ?? null;
}

export async function saveCellScores(scores: Record<string, unknown>[]): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('cell_scores').upsert(scores, { onConflict: 'cell_id,group_id,period_id' });
  return !error;
}

export async function saveCellOwnership(ownership: Record<string, unknown>[]): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('cell_ownership').upsert(ownership, { onConflict: 'cell_id,period_id' });
  return !error;
}

export async function getCellOwnership(periodId?: string) {
  if (!supabase) return [];
  let query = supabase.from('cell_ownership').select('*');
  if (periodId) query = query.eq('period_id', periodId);
  const { data } = await query;
  return data ?? [];
}
