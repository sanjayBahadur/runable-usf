import { supabase } from '@/src/lib/supabase/client';
import type { Coordinate, Sighting, SightingCategory } from '@/src/types';

type DbSightingCategory = 'wildlife' | 'hazard' | 'landmark' | 'event' | 'other';

const appToDbSightingCategory: Record<SightingCategory, DbSightingCategory> = {
  animal: 'wildlife',
  plant: 'wildlife',
  scenic: 'event',
  water: 'event',
  landmark: 'landmark',
  other: 'other',
};

const dbToAppSightingCategory: Record<DbSightingCategory, SightingCategory> = {
  wildlife: 'animal',
  hazard: 'other',
  landmark: 'landmark',
  event: 'scenic',
  other: 'other',
};

export type SightingInsertInput = {
  title: string;
  description?: string;
  category: SightingCategory;
  coordinate: Coordinate;
  reported_by_user_id: string;
  photo_uri?: string;
  created_at: string;
};

export async function createSighting(sighting: SightingInsertInput): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('sightings').insert({
    title: sighting.title,
    description: sighting.description,
    category: appToDbSightingCategory[sighting.category],
    latitude: sighting.coordinate[0],
    longitude: sighting.coordinate[1],
    reported_by_user_id: sighting.reported_by_user_id,
    photo_path: sighting.photo_uri,
    created_at: sighting.created_at,
  }).select('id').single();
  if (error) {
    console.error('createSighting failed', error.message);
  }
  return data?.id ?? null;
}

export function mapSightingRow(d: Record<string, unknown>): Sighting {
  const dbCategory = (d.category as DbSightingCategory) ?? 'other';
  return {
    id: String(d.id ?? ''),
    title: String(d.title ?? ''),
    description: d.description ? String(d.description) : undefined,
    category: dbToAppSightingCategory[dbCategory] ?? 'other',
    coordinate: [Number(d.latitude ?? 0), Number(d.longitude ?? 0)],
    reportedByUserId: String(d.reported_by_user_id ?? ''),
    photoUri: d.photo_path ? String(d.photo_path) : undefined,
    createdAt: String(d.created_at ?? new Date().toISOString()),
  };
}

export async function getSightings(): Promise<Sighting[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('sightings').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('getSightings failed', error.message);
    return [];
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapSightingRow);
}
