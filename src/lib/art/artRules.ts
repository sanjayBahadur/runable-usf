import type { CellArt, CellOwnership } from '@/src/types';

export function canPaintCell(userGroupId: string, cellOwnership?: CellOwnership): boolean {
  if (!cellOwnership) {
    return false;
  }

  return cellOwnership.groupId === userGroupId;
}

export function applyCellPaint(
  cellId: string,
  groupId: string,
  color: string,
  existingArt: CellArt[],
  updatedByUserId = 'demo-user',
): CellArt[] {
  const nextEntry: CellArt = {
    cellId,
    groupId,
    color,
    updatedByUserId,
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = existingArt.findIndex((entry) => entry.cellId === cellId);

  if (existingIndex === -1) {
    return [...existingArt, nextEntry];
  }

  const nextArt = [...existingArt];
  nextArt[existingIndex] = nextEntry;

  return nextArt;
}

export function getVisibleCellArt(cellOwnership: CellOwnership[], cellArt: CellArt[]): CellArt[] {
  const ownershipByCellId = new Map(cellOwnership.map((entry) => [entry.cellId, entry]));

  return cellArt.filter((entry) => ownershipByCellId.get(entry.cellId)?.groupId === entry.groupId);
}
