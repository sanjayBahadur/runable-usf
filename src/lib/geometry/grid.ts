import type { CampusCell, Coordinate } from '@/src/types';

import { isPointInsidePolygon } from '@/src/lib/geometry/pointInPolygon';

const METERS_PER_DEGREE_LATITUDE = 111_320;

function metersToLatitudeDegrees(meters: number): number {
  return meters / METERS_PER_DEGREE_LATITUDE;
}

function metersToLongitudeDegrees(meters: number, latitude: number): number {
  return meters / (METERS_PER_DEGREE_LATITUDE * Math.cos((latitude * Math.PI) / 180));
}

export function generateCampusGrid(
  campusBoundary: Coordinate[],
  cellSizeMeters: number,
): CampusCell[] {
  if (campusBoundary.length < 3 || cellSizeMeters <= 0) {
    return [];
  }

  const latitudes = campusBoundary.map(([latitude]) => latitude);
  const longitudes = campusBoundary.map(([, longitude]) => longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);
  const centerLatitude = (minLatitude + maxLatitude) / 2;
  const latitudeStep = metersToLatitudeDegrees(cellSizeMeters);
  const longitudeStep = metersToLongitudeDegrees(cellSizeMeters, centerLatitude);

  const cells: CampusCell[] = [];

  let row = 0;
  for (let south = minLatitude; south < maxLatitude; south += latitudeStep) {
    const north = south + latitudeStep;
    const centerLatitudeForRow = south + latitudeStep / 2;

    let column = 0;
    for (let west = minLongitude; west < maxLongitude; west += longitudeStep) {
      const east = west + longitudeStep;
      const center: Coordinate = [centerLatitudeForRow, west + longitudeStep / 2];

      if (isPointInsidePolygon(center, campusBoundary)) {
        const polygon: Coordinate[] = [
          [south, west],
          [south, east],
          [north, east],
          [north, west],
          [south, west],
        ];

        cells.push({
          id: `cell-${row}-${column}`,
          row,
          column,
          center,
          sizeMeters: cellSizeMeters,
          polygon,
        });
      }

      column += 1;
    }

    row += 1;
  }

  return cells;
}
