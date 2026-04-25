import type { EntityId, ISODateString } from '@/src/types/common';

export type CellArt = {
  cellId: EntityId;
  groupId: EntityId;
  pixels: string[];
  patternId?: string;
  updatedByUserId: EntityId;
  updatedAt: ISODateString;
};
