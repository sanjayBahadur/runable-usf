import { useCallback, useEffect, useState } from 'react';

import { createSighting as generateSighting } from '@/src/features/sightings';
import { createSighting, getSightings } from '@/src/lib/supabase/sightingService';
import type { Sighting, SightingCategory } from '@/src/types';

type UseSightingsOptions = {
  initialSightings?: Sighting[];
  currentUserId: string;
};

export function useSightings({ initialSightings = [], currentUserId }: UseSightingsOptions) {
  const [sightings, setSightings] = useState<Sighting[]>(initialSightings);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSightings();
        if (data && data.length > 0) {
          const mapped: Sighting[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            description: d.description,
            category: d.category,
            coordinate: d.coordinate,
            reportedByUserId: d.reported_by_user_id,
            photoUri: d.photo_uri,
            createdAt: d.created_at,
          }));
          setSightings(mapped);
        }
      } catch (err) {
        console.warn('Failed to load realtime sightings', err);
      }
    }
    load();
  }, []);

  const addSighting = useCallback(
    (input: {
      title: string;
      category: SightingCategory;
      coordinate: [number, number];
      description?: string;
      photoUri?: string;
    }) => {
      const newSighting = generateSighting({
        ...input,
        reportedByUserId: currentUserId,
      });

      setSightings((prev) => [newSighting, ...prev]);

      createSighting({
        id: newSighting.id,
        title: newSighting.title,
        description: newSighting.description,
        category: newSighting.category,
        coordinate: newSighting.coordinate,
        reported_by_user_id: newSighting.reportedByUserId,
        photo_uri: newSighting.photoUri,
        created_at: newSighting.createdAt,
      }).catch(e => console.error("Failed to commit sighting to Supabase", e));

      return newSighting;
    },
    [currentUserId],
  );

  return {
    sightings,
    addSighting,
  };
}
