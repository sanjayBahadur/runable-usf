import type { EntityId, ISODateString } from '@/src/types/common';

export type GamePeriod = {
  id: EntityId;
  name: string;
  startAt: ISODateString;
  endAt: ISODateString;
  status: 'upcoming' | 'active' | 'completed';
  archivedAt?: ISODateString;
};
