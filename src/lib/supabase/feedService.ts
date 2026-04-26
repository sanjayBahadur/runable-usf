import { supabase } from '@/src/lib/supabase/client';
import type { FeedItem } from '@/src/types';

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

export async function getScopedFeedItems(params: {
  currentGroupId?: string;
  scope: 'global' | 'clan';
  limit?: number;
}): Promise<FeedItem[]> {
  if (!supabase) return [];
  const limit = params.limit ?? 50;

  let query = supabase
    .from('feed_items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (params.scope === 'global') {
    query = query.or('visibility_scope.eq.global,visibility_scope.is.null');
  } else if (params.currentGroupId) {
    query = query.or(
      `and(visibility_scope.eq.group,target_group_id.eq.${params.currentGroupId}),and(visibility_scope.is.null,group_id.eq.${params.currentGroupId})`,
    );
  } else {
    return [];
  }

  const { data } = await query;
  const mapped = ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    id: String(row.id ?? ''),
    type: row.type as FeedItem['type'],
    actorUserId: String(row.actor_user_id ?? ''),
    groupId: row.group_id ? String(row.group_id) : undefined,
    title: String(row.title ?? ''),
    body: String(row.body ?? ''),
    visibilityScope:
      row.visibility_scope === 'group' || row.visibility_scope === 'global'
        ? row.visibility_scope
        : undefined,
    targetGroupId: row.target_group_id ? String(row.target_group_id) : undefined,
    relatedEntityId: row.related_entity_id ? String(row.related_entity_id) : undefined,
    createdAt: String(row.created_at ?? new Date().toISOString()),
  }));
  return mapped;
}
