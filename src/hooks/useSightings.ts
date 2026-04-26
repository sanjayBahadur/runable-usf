import { useCallback, useEffect, useState } from 'react';

import { createSighting as generateSighting } from '@/src/features/sightings';
import { createSighting, getSightings } from '@/src/lib/supabase/sightingService';
import type { PhotoVerificationResult, Sighting, SightingCategory } from '@/src/types';

type UseSightingsOptions = {
  initialSightings?: Sighting[];
  currentUserId: string;
  enabled?: boolean;
};

export function useSightings({ initialSightings = [], currentUserId, enabled = true }: UseSightingsOptions) {
  const [sightings, setSightings] = useState<Sighting[]>(initialSightings);

  useEffect(() => {
    if (!enabled) {
      setSightings(initialSightings);
      return;
    }
    async function load() {
      try {
        const data = await getSightings();
        setSightings(data);
      } catch (err) {
        console.warn('Failed to load realtime sightings', err);
      }
    }
    void load();
  }, [enabled, initialSightings]);

  const addSighting = useCallback(
    (input: {
      title: string;
      category: SightingCategory;
      coordinate: [number, number];
      description?: string;
      photoUri?: string;
      photoVerification?: PhotoVerificationResult;
    }) => {
      const newSighting = generateSighting({
        ...input,
        reportedByUserId: currentUserId,
      });

      setSightings((prev) => [newSighting, ...prev]);

      if (!enabled) {
        return newSighting;
      }

      createSighting({
        title: newSighting.title,
        description: newSighting.description,
        category: newSighting.category,
        coordinate: newSighting.coordinate,
        reported_by_user_id: newSighting.reportedByUserId,
        photo_uri: newSighting.photoUri,
        created_at: newSighting.createdAt,
      }).then((persistedId) => {
        if (!persistedId) return;
        setSightings((existing) => existing.map((entry) => (
          entry.id === newSighting.id ? { ...entry, id: persistedId } : entry
        )));
      }).catch(e => console.error("Failed to commit sighting to Supabase", e));

      return newSighting;
    },
    [currentUserId, enabled],
  );

  return {
    sightings,
    addSighting,
  };
}
