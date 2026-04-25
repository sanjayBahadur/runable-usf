import type { EntityId, ISODateString } from '@/src/types/common';

export type UserProfile = {
  id: EntityId;
  username: string;
  displayName: string;
  avatarUrl?: string;
  homeGroupId?: EntityId;
  points: number;
  createdAt: ISODateString;
};
