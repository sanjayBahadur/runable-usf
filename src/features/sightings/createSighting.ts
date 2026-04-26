import type { Coordinate, PhotoVerificationResult, Sighting, SightingCategory } from '@/src/types';

type CreateSightingInput = {
  title: string;
  category: SightingCategory;
  coordinate: Coordinate;
  reportedByUserId: string;
  description?: string;
  photoUri?: string;
  photoVerification?: PhotoVerificationResult;
};

export function createSighting(input: CreateSightingInput): Sighting {
  return {
    id: `sighting-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: input.title,
    description: input.description,
    category: input.category,
    coordinate: input.coordinate,
    reportedByUserId: input.reportedByUserId,
    photoUri: input.photoUri,
    photoVerification: input.photoVerification,
    createdAt: new Date().toISOString(),
  };
}
