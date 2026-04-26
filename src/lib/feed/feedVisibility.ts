import type { FeedItem } from '@/src/types';

export function getVisibleFeedItems(feedItems: FeedItem[]): FeedItem[] {
  return [...feedItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
