import type { EntityId } from '@/src/types/common';

export type LeaderboardScope = 'daily' | 'weekly' | 'seasonal' | 'all_time';

export type LeaderboardEntry = {
  entityId: EntityId;
  entityType: 'user' | 'group';
  displayName: string;
  points: number;
  rank: number;
  change?: number;
};
