import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CommentInput } from '@/src/components/feed/CommentInput';
import { CommentList } from '@/src/components/feed/CommentList';
import { LikeButton } from '@/src/components/feed/LikeButton';
import type { FeedItem } from '@/src/types';

type FeedItemCardProps = {
  item: FeedItem;
  liked: boolean;
  likeCount: number;
  comments: string[];
  actorName?: string;
  onToggleLike: () => void;
  onAddComment: (comment: string) => void;
};

export function FeedItemCard({
  item,
  liked,
  likeCount,
  comments,
  actorName,
  onToggleLike,
  onAddComment,
}: FeedItemCardProps) {
  return (
    <View style={styles.card}>
      <ThemedText type="subtitle">{item.title}</ThemedText>
      <ThemedText>{item.body}</ThemedText>
      <ThemedText>{actorName ?? item.actorUserId}</ThemedText>
      <ThemedText>{new Date(item.createdAt).toLocaleString()}</ThemedText>
      <View style={styles.actionRow}>
        <LikeButton liked={liked} likeCount={likeCount} onPress={onToggleLike} />
      </View>
      <CommentList comments={comments} />
      <CommentInput onSubmit={onAddComment} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
