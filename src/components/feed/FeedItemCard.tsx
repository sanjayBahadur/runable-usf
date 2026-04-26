import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';
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
      <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
      <ThemedText>{item.body}</ThemedText>
      <View style={styles.metaRow}>
        <ThemedText style={styles.meta}>{actorName ?? item.actorUserId}</ThemedText>
        <ThemedText style={styles.meta}>
          {new Date(item.createdAt).toLocaleString()}
        </ThemedText>
      </View>

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
    gap: RUNABLE_THEME.spacing.sm,
    padding: RUNABLE_THEME.spacing.md,
    borderRadius: RUNABLE_THEME.radii.md,
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderWidth: 1,
    borderColor: RUNABLE_THEME.colors.border,
    ...RUNABLE_THEME.shadows.soft,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: RUNABLE_THEME.spacing.xs,
  },
  meta: {
    fontSize: RUNABLE_THEME.fontSizes.xs,
    color: RUNABLE_THEME.colors.ink,
  },
  actionRow: {
    flexDirection: 'row',
    gap: RUNABLE_THEME.spacing.xs,
  },
});
