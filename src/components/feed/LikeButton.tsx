import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';

type LikeButtonProps = {
  liked: boolean;
  likeCount: number;
  onPress: () => void;
};

export function LikeButton({ liked, likeCount, onPress }: LikeButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        liked ? styles.active : styles.inactive,
        pressed ? styles.pressed : null,
      ]}>
      <ThemedText
        type="defaultSemiBold"
        lightColor={liked ? '#F8FAFC' : RUNABLE_THEME.colors.ink}
        darkColor={liked ? '#F8FAFC' : '#CBD5E1'}>
        {liked ? '♥ Liked' : '♡ Like'} {likeCount > 0 ? likeCount : ''}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: RUNABLE_THEME.spacing.sm,
    paddingVertical: 8,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
  },
  active: {
    backgroundColor: RUNABLE_THEME.colors.xpBlue,
  },
  inactive: {
    backgroundColor: RUNABLE_THEME.colors.cream,
  },
  pressed: {
    transform: [{ translateY: 1 }],
    backgroundColor: RUNABLE_THEME.colors.windowGray,
  },
});
