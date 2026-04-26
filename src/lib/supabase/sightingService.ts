import { supabase } from '@/src/lib/supabase/client';

export async function createSighting(sighting: Record<string, unknown>): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('sightings').insert(sighting).select('id').single();
  return data?.id ?? null;
}

export async function getSightings() {
  if (!supabase) return [];
  const { data } = await supabase.from('sightings').select('*').order('created_at', { ascending: false });
  return data ?? [];
}
