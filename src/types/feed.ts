import type { EntityId, ISODateString } from '@/src/types/common';

export type FeedItemType =
  | 'run_completed'
  | 'territory_claimed'
  | 'issue_reported'
  | 'issue_fixed'
  | 'sighting_added'
  | 'landmark_named'
  | 'art_updated';

export type FeedItem = {
  id: EntityId;
  type: FeedItemType;
  actorUserId: EntityId;
  groupId?: EntityId;
  title: string;
  body: string;
  relatedEntityId?: EntityId;
  createdAt: ISODateString;
};
