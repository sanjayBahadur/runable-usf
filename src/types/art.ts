import type { EntityId, ISODateString } from '@/src/types/common';

export type CellArt = {
  cellId: EntityId;
  groupId: EntityId;
  color: string;
  leftCard?: string;
  rightCard?: string;
  pixels?: string[];
  patternId?: string;
  updatedByUserId: EntityId;
  updatedAt: ISODateString;
};
