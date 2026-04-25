import type { Coordinate, EntityId, ISODateString } from '@/src/types/common';

export type IssueStatus = 'open' | 'fixed';

export type IssueReport = {
  id: EntityId;
  title: string;
  description?: string;
  coordinate: Coordinate;
  status: IssueStatus;
  reportedByUserId: EntityId;
  fixedByUserId?: EntityId;
  photoUri?: string;
  createdAt: ISODateString;
  fixedAt?: ISODateString;
};
