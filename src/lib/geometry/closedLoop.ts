import type { ClosedLoopResult, Coordinate, RunPoint } from '@/src/types';

import { calculateDistanceMeters } from '@/src/lib/geometry/haversine';
import { calculatePathDistanceMeters } from '@/src/lib/geometry/pathDistance';
import { calculatePolygonAreaSquareMeters } from '@/src/lib/geometry/polygonArea';

type PathPoint = Coordinate | RunPoint;

export type ClosedLoopRules = {
  minPathDistanceMeters: number;
  minAreaSquareMeters: number;
  minGpsPoints: number;
  closeLoopThresholdMeters: number;
};

function toCoordinate(point: PathPoint): Coordinate {
  return Array.isArray(point) ? point : point.coordinate;
}

export function detectClosedLoop(path: PathPoint[], rules: ClosedLoopRules): ClosedLoopResult {
  const coordinates = path.map(toCoordinate);
  const pointCount = coordinates.length;
  const totalDistanceMeters = calculatePathDistanceMeters(coordinates);
  const closingDistanceMeters =
    pointCount >= 2 ? calculateDistanceMeters(coordinates[0], coordinates[pointCount - 1]) : Infinity;
  const enclosedAreaSquareMeters =
    pointCount >= 3 ? calculatePolygonAreaSquareMeters(coordinates) : 0;
  const isClosed = closingDistanceMeters <= rules.closeLoopThresholdMeters;

  const passesRules =
    pointCount >= rules.minGpsPoints &&
    totalDistanceMeters >= rules.minPathDistanceMeters &&
    enclosedAreaSquareMeters >= rules.minAreaSquareMeters &&
    isClosed;

  return {
    isClosed,
    pointCount,
    totalDistanceMeters,
    enclosedAreaSquareMeters,
    closingDistanceMeters,
    passesRules,
  };
}
