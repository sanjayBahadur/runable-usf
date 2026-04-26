import type { Coordinate, RunPoint } from '@/src/types';

import { isPointInsidePolygon } from '@/src/lib/geometry/pointInPolygon';

type PathPoint = Coordinate | RunPoint;

function toCoordinate(point: PathPoint): Coordinate {
  return Array.isArray(point) ? point : point.coordinate;
}

export function isPathInsideCampus(path: PathPoint[], campusBoundary: Coordinate[]): boolean {
  if (path.length === 0 || campusBoundary.length < 3) {
    return false;
  }

  const insidePointCount = path.reduce((count, point) => {
    return count + Number(isPointInsidePolygon(toCoordinate(point), campusBoundary));
  }, 0);

  return insidePointCount / path.length >= 0.8;
}
