import type { Coordinate } from '@/src/types';

const EPSILON = 1e-10;

function isPointOnSegment(point: Coordinate, start: Coordinate, end: Coordinate): boolean {
  const [py, px] = point;
  const [sy, sx] = start;
  const [ey, ex] = end;

  const cross = (py - sy) * (ex - sx) - (px - sx) * (ey - sy);
  if (Math.abs(cross) > EPSILON) {
    return false;
  }

  const minX = Math.min(sx, ex) - EPSILON;
  const maxX = Math.max(sx, ex) + EPSILON;
  const minY = Math.min(sy, ey) - EPSILON;
  const maxY = Math.max(sy, ey) + EPSILON;

  return px >= minX && px <= maxX && py >= minY && py <= maxY;
}

export function isPointInsidePolygon(point: Coordinate, polygon: Coordinate[]): boolean {
  if (polygon.length < 3) {
    return false;
  }

  let isInside = false;

  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];

    if (isPointOnSegment(point, current, next)) {
      return true;
    }

    const [currentLat, currentLon] = current;
    const [nextLat, nextLon] = next;
    const [pointLat, pointLon] = point;

    const intersects =
      currentLon > pointLon !== nextLon > pointLon &&
      pointLat <
        ((nextLat - currentLat) * (pointLon - currentLon)) / (nextLon - currentLon) + currentLat;

    if (intersects) {
      isInside = !isInside;
    }
  }

  return isInside;
}
