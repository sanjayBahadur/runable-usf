import { USF_ACCESS_BOUNDARY, USF_MAP_CENTER } from '@/src/constants';
import { calculateDistanceMeters, isPointInsidePolygon } from '@/src/lib/geometry';
import type { Coordinate } from '@/src/types';

export type CampusAccessState = 'unknown' | 'onCampus' | 'nearCampus' | 'offCampus';

export function isUserInsideCampus(
  userLocation?: Coordinate | null,
  campusBoundary: Coordinate[] = USF_ACCESS_BOUNDARY,
): boolean {
  if (!userLocation) {
    return false;
  }

  return isPointInsidePolygon(userLocation, campusBoundary);
}

export function getCampusAccessState(userLocation?: Coordinate | null): CampusAccessState {
  if (!userLocation) {
    return 'unknown';
  }

  if (isUserInsideCampus(userLocation)) {
    return 'onCampus';
  }

  const distanceToCampusMeters = calculateDistanceMeters(userLocation, USF_MAP_CENTER);

  if (distanceToCampusMeters <= 800) {
    return 'nearCampus';
  }

  return 'offCampus';
}

export function getOffCampusMessage(accessState: CampusAccessState): string {
  switch (accessState) {
    case 'onCampus':
      return 'You are inside the USF play zone. Live campus actions are available.';
    case 'nearCampus':
      return 'You are near the USF play zone. Explore the map and demo mode, but live claims stay campus-only.';
    case 'offCampus':
      return 'You are outside the USF play zone. You can explore the map and use demo mode, but live claims only activate on campus.';
    case 'unknown':
    default:
      return 'Campus access is unknown. Preview mode is available until location is confirmed.';
  }
}
