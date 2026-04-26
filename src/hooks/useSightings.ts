import { useCallback, useState } from 'react';

import { createSighting } from '@/src/features/sightings';
import type { Sighting, SightingCategory } from '@/src/types';

type UseSightingsOptions = {
  initialSightings?: Sighting[];
  currentUserId: string;
};

export function useSightings({ initialSightings = [], currentUserId }: UseSightingsOptions) {
  const [sightings, setSightings] = useState<Sighting[]>(initialSightings);

  const addSighting = useCallback(
    (input: {
      title: string;
      category: SightingCategory;
      coordinate: [number, number];
      description?: string;
      photoUri?: string;
    }) => {
      const newSighting = createSighting({
        ...input,
        reportedByUserId: currentUserId,
      });

      setSightings((prev) => [newSighting, ...prev]);

      return newSighting;
    },
    [currentUserId],
  );

  return {
    sightings,
    addSighting,
  };
}
