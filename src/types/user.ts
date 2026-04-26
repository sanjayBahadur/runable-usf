import type { EntityId, ISODateString } from '@/src/types/common';

export type GroupMembershipRole = 'member' | 'executive';

export type UserProfile = {
  id: EntityId;
  username: string;
  displayName: string;
  avatarUrl?: string;
  homeGroupId?: EntityId;
  groupRole?: GroupMembershipRole;
  points: number;
  createdAt: ISODateString;
};
