import type { EntityId, ISODateString } from '@/src/types/common';

export type Group = {
  id: EntityId;
  name: string;
  slug: string;
  description?: string;
  primaryColor: string;
  accentColor: string;
  memberCount: number;
  totalPoints: number;
  createdAt: ISODateString;
};
