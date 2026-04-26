import { supabase } from '@/src/lib/supabase/client';

export async function insertFeedItem(item: Record<string, unknown>): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('feed_items').insert(item).select('id').single();
  return data?.id ?? null;
}

export async function getFeedItems(limit = 50) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('feed_items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}
