import { supabase } from '@/src/lib/supabase/client';

export async function saveCellArt(cellArt: {
  cell_id: string;
  group_id: string;
  color: string;
  left_card?: string;
  right_card?: string;
  pattern_id?: string;
  updated_by_user_id: string;
}): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('cell_art').upsert(cellArt, { onConflict: 'cell_id' });
  return !error;
}

export async function getCellArt() {
  if (!supabase) return [];
  const { data } = await supabase.from('cell_art').select('*');
  return data ?? [];
}
