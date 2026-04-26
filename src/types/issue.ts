import type { Coordinate, EntityId, ISODateString } from '@/src/types/common';
import type { PhotoVerificationResult } from '@/src/types/ai';
import type { UserProfile } from '@/src/types/user';

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
  photoVerification?: PhotoVerificationResult;
  fixVerification?: PhotoVerificationResult;
  fixDescription?: string;
  isFalseCompletion?: boolean;
  commentsCount?: number;
  likesCount?: number;
  createdAt: ISODateString;
  fixedAt?: ISODateString;
};

export type IssueComment = {
  id: string;
  issueId: string;
  userId: string;
  content: string;
  createdAt: ISODateString;
  user?: Partial<UserProfile>;
};

export type IssueLike = {
  issueId: string;
  userId: string;
  createdAt: ISODateString;
};

export type FalseCompletion = {
  id: string;
  issueId: string;
  reporterId: string;
  description: string;
  verificationResult?: PhotoVerificationResult;
  isVerified?: boolean;
  createdAt: ISODateString;
};
