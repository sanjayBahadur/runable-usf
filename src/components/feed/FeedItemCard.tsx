import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { CommentInput } from '@/src/components/feed/CommentInput';
import { CommentList } from '@/src/components/feed/CommentList';
import { LikeButton } from '@/src/components/feed/LikeButton';
import { GlossyButton } from '@/src/components/ui';
import type { FeedItem } from '@/src/types';

const paintPalette = [
  '#006747', '#CFC493', '#F97316', '#0EA5E9',
  '#FACC15', '#F43F5E', '#22C55E', '#A855F7',
];

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
  const [selectedColor, setSelectedColor] = useState(paintPalette[0]);
  const isTerritoryClaim = item.type === 'territory_claimed';

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

      {/* Editing colors of covered areas straight from the feed */}
      {isTerritoryClaim && (
        <View style={styles.paintSection}>
          <ThemedText type="defaultSemiBold">🎨 Edit Area Color</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paletteRow}>
            {paintPalette.map((color) => (
              <Pressable
                key={color}
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  selectedColor === color ? styles.selectedSwatch : null,
                ]}
              />
            ))}
          </ScrollView>
          <GlossyButton
            label="Save Color to Map"
            onPress={() => {}}
            tone="secondary"
            compact
          />
        </View>
      )}

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
  paintSection: {
    gap: RUNABLE_THEME.spacing.xs,
    padding: RUNABLE_THEME.spacing.sm,
    backgroundColor: RUNABLE_THEME.colors.cream,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 1,
    borderColor: RUNABLE_THEME.colors.border,
    marginVertical: RUNABLE_THEME.spacing.xs,
  },
  paletteRow: {
    gap: 8,
    paddingVertical: 4,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
  },
  selectedSwatch: {
    borderColor: RUNABLE_THEME.colors.xpBlue,
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
});
