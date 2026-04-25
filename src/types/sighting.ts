import type { Coordinate, EntityId, ISODateString } from '@/src/types/common';

export type SightingCategory = 'wildlife' | 'hazard' | 'landmark' | 'event' | 'other';

export type Sighting = {
  id: EntityId;
  title: string;
  description?: string;
  category: SightingCategory;
  coordinate: Coordinate;
  reportedByUserId: EntityId;
  photoUri?: string;
  createdAt: ISODateString;
};
