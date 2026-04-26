import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type LikeButtonProps = {
  liked: boolean;
  likeCount: number;
  onPress: () => void;
};

export function LikeButton({ liked, likeCount, onPress }: LikeButtonProps) {
  return (
    <Pressable onPress={onPress} style={[styles.button, liked ? styles.active : undefined]}>
      <ThemedText>{liked ? 'Liked' : 'Like'} {likeCount}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
  },
  active: {
    backgroundColor: 'rgba(14, 165, 233, 0.16)',
  },
});
