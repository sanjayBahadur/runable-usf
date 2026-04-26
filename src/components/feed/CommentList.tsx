import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type CommentListProps = {
  comments: string[];
};

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return <ThemedText>No comments yet.</ThemedText>;
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
    gap: 8,
  },
  comment: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
  },
});
