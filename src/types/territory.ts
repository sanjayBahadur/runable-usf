import type { Coordinate, EntityId, ISODateString } from '@/src/types/common';

export type CampusCell = {
  id: EntityId;
  row: number;
  column: number;
  center: Coordinate;
  sizeMeters: number;
  polygon: Coordinate[];
};

export type ClaimPolygon = {
  id: EntityId;
  runSessionId: EntityId;
  userId: EntityId;
  groupId: EntityId;
  boundary: Coordinate[];
  areaSquareMeters: number;
  createdAt: ISODateString;
};

export type CellScore = {
  cellId: EntityId;
  groupId: EntityId;
  score: number;
  sourceClaimIds: EntityId[];
};

export type CellOwnership = {
  cellId: EntityId;
  groupId: EntityId;
  score: number;
  updatedAt: ISODateString;
};
