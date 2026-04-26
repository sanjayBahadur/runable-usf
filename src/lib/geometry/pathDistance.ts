import type { Coordinate, RunPoint } from '@/src/types';

import { calculateDistanceMeters } from '@/src/lib/geometry/haversine';

type PathPoint = Coordinate | RunPoint;

function toCoordinate(point: PathPoint): Coordinate {
  return Array.isArray(point) ? point : point.coordinate;
}

export function calculatePathDistanceMeters(path: PathPoint[]): number {
  if (path.length < 2) {
    return 0;
  }

  let totalDistanceMeters = 0;

  for (let index = 1; index < path.length; index += 1) {
    totalDistanceMeters += calculateDistanceMeters(
      toCoordinate(path[index - 1]),
      toCoordinate(path[index]),
    );
  }

  return totalDistanceMeters;
}
