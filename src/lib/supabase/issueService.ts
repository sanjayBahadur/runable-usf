import { supabase } from '@/src/lib/supabase/client';
import type { Coordinate, IssueCategory, IssueReport } from '@/src/types';

export type IssueInsertInput = {
  title: string;
  category: IssueCategory;
  description?: string;
  coordinate: Coordinate;
  status: 'open' | 'fixed';
  reported_by_user_id: string;
  photo_uri?: string;
  created_at: string;
};

export async function createIssue(issue: IssueInsertInput): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('issues').insert({
    title: issue.title,
    category: issue.category,
    description: issue.description,
    latitude: issue.coordinate[0],
    longitude: issue.coordinate[1],
    status: issue.status,
    reported_by_user_id: issue.reported_by_user_id,
    photo_path: issue.photo_uri,
    created_at: issue.created_at,
  }).select('id').single();
  if (error) {
    console.error('createIssue failed', error.message);
  }
  return data?.id ?? null;
}

export async function updateIssue(
  issueId: string,
  updates: Record<string, unknown>,
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('issues').update(updates).eq('id', issueId);
  if (error) {
    console.error('updateIssue failed', error.message);
  }
  return !error;
}

export function mapIssueRow(d: Record<string, unknown>): IssueReport {
  return {
    id: String(d.id ?? ''),
    title: String(d.title ?? ''),
    category: d.category as IssueCategory,
    description: d.description ? String(d.description) : undefined,
    coordinate: [Number(d.latitude ?? 0), Number(d.longitude ?? 0)],
    status: (d.status as 'open' | 'fixed') ?? 'open',
    reportedByUserId: String(d.reported_by_user_id ?? ''),
    fixedByUserId: d.fixed_by_user_id ? String(d.fixed_by_user_id) : undefined,
    photoUri: d.photo_path ? String(d.photo_path) : undefined,
    afterPhotoUri: d.after_photo_path ? String(d.after_photo_path) : undefined,
    isFalseCompletion: Boolean(d.is_false_completion),
    createdAt: String(d.created_at ?? new Date().toISOString()),
    fixedAt: d.fixed_at ? String(d.fixed_at) : undefined,
  };
}

export async function getIssues(): Promise<IssueReport[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('issues').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('getIssues failed', error.message);
    return [];
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapIssueRow);
}
