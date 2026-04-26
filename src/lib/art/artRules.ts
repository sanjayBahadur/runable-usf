import type { CellArt, CellOwnership } from '@/src/types';

export function canPaintCell(userGroupId: string, cellOwnership?: CellOwnership): boolean {
  if (!cellOwnership) {
    return false;
  }

  return cellOwnership.groupId === userGroupId;
}

export function canCustomizeCell(input: {
  userId: string;
  userGroupId?: string;
  userGroupRole?: 'member' | 'executive';
  ownership?: CellOwnership;
}): boolean {
  const { userId, userGroupId, userGroupRole, ownership } = input;
  if (!ownership) return false;

  const contested = Boolean((ownership.runnerUpScore ?? 0) > 0);
  const fromCompletedLap = Boolean(ownership.sourceClaimIds?.length);
  if (!fromCompletedLap) return false;

  if (userGroupId) {
    // Clan-controlled customization is executive-only.
    if (ownership.groupId !== userGroupId) return false;
    return userGroupRole === 'executive';
  }

  // Solo players can only customize uncontested tiles they directly own.
  return ownership.groupId === userId && !contested;
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
