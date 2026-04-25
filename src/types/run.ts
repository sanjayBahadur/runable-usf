import type { Coordinate, EntityId, ISODateString } from '@/src/types/common';

export type RunPoint = {
  coordinate: Coordinate;
  recordedAt: ISODateString;
  accuracyMeters?: number;
};

export type ClosedLoopResult = {
  isClosed: boolean;
  pointCount: number;
  totalDistanceMeters: number;
  enclosedAreaSquareMeters: number;
  closingDistanceMeters: number;
  passesRules: boolean;
};

export type RunSession = {
  id: EntityId;
  userId: EntityId;
  groupId: EntityId;
  path: RunPoint[];
  startedAt: ISODateString;
  endedAt?: ISODateString;
  distanceMeters: number;
  status: 'draft' | 'recording' | 'completed' | 'invalid';
  loopResult?: ClosedLoopResult;
};
