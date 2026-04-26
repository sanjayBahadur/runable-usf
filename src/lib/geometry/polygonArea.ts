import type { Coordinate } from '@/src/types';

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function projectCoordinate(coordinate: Coordinate, referenceLatitudeRadians: number) {
  const [latitude, longitude] = coordinate;

  return {
    x: EARTH_RADIUS_METERS * toRadians(longitude) * Math.cos(referenceLatitudeRadians),
    y: EARTH_RADIUS_METERS * toRadians(latitude),
  };
}

export function calculatePolygonAreaSquareMeters(polygon: Coordinate[]): number {
  if (polygon.length < 3) {
    return 0;
  }

  const averageLatitude =
    polygon.reduce((sum, [latitude]) => sum + latitude, 0) / polygon.length;
  const referenceLatitudeRadians = toRadians(averageLatitude);

  let shoelaceSum = 0;

  for (let index = 0; index < polygon.length; index += 1) {
    const current = projectCoordinate(polygon[index], referenceLatitudeRadians);
    const next = projectCoordinate(polygon[(index + 1) % polygon.length], referenceLatitudeRadians);

    shoelaceSum += current.x * next.y - next.x * current.y;
  }

  return Math.abs(shoelaceSum) / 2;
}
