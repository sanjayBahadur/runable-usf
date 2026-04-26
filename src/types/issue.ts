import type { Coordinate, EntityId, ISODateString } from '@/src/types/common';

export type IssueStatus = 'open' | 'fixed';
export type IssueCategory = 'Litter' | 'Broken Infrastructure' | 'Pavement Damage' | 'Other';

export type IssueReport = {
  id: EntityId;
  title: string;
  category: IssueCategory;
  description?: string;
  coordinate: Coordinate;
  status: IssueStatus;
  reportedByUserId: EntityId;
  fixedByUserId?: EntityId;
  photoUri?: string;
  afterPhotoUri?: string;
  createdAt: ISODateString;
  fixedAt?: ISODateString;
};
