import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';

type CommentListProps = {
  comments: string[];
};

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <ThemedText style={styles.empty}>No comments yet.</ThemedText>
    );
  }

  return (
    <View style={styles.container}>
      {comments.map((comment, index) => (
        <View key={`${comment}-${index}`} style={styles.comment}>
          <ThemedText>{comment}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: RUNABLE_THEME.spacing.xs,
  },
  comment: {
    padding: RUNABLE_THEME.spacing.sm,
    borderRadius: RUNABLE_THEME.radii.sm,
    backgroundColor: RUNABLE_THEME.colors.cream,
    borderWidth: 1,
    borderColor: RUNABLE_THEME.colors.border,
  },
  empty: {
    color: RUNABLE_THEME.colors.ink,
    fontSize: RUNABLE_THEME.fontSizes.sm,
  },
});
