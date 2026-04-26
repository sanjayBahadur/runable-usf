import type { CampusCell, Coordinate } from '@/src/types';

import { isPointInsidePolygon } from '@/src/lib/geometry/pointInPolygon';

export function getCellsInsidePolygon(cells: CampusCell[], polygon: Coordinate[]): CampusCell[] {
  return cells.filter((cell) => isPointInsidePolygon(cell.center, polygon));
}
