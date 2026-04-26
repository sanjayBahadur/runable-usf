import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';

type GlossyButtonProps = {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'secondary' | 'danger' | 'dark';
  compact?: boolean;
  disabled?: boolean;
};

export function GlossyButton({
  label,
  onPress,
  tone = 'primary',
  compact = false,
  disabled = false,
}: GlossyButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[tone],
        compact ? styles.compact : null,
        pressed ? styles.pressed : null,
        disabled ? { opacity: 0.5 } : null,
      ]}>
      <ThemedText
        type="defaultSemiBold"
        lightColor={tone === 'dark' ? '#F8FAFC' : RUNABLE_THEME.colors.ink}
        darkColor={tone === 'dark' ? '#F8FAFC' : RUNABLE_THEME.colors.ink}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: RUNABLE_THEME.spacing.md,
    paddingVertical: 10,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...RUNABLE_THEME.shadows.soft,
  },
  compact: {
    minHeight: 36,
    paddingHorizontal: RUNABLE_THEME.spacing.sm,
    paddingVertical: 8,
  },
  primary: {
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderColor: RUNABLE_THEME.colors.border,
  },
  secondary: {
    backgroundColor: RUNABLE_THEME.colors.windowGray,
    borderColor: RUNABLE_THEME.colors.border,
  },
  danger: {
    backgroundColor: '#F8D9D6',
    borderColor: RUNABLE_THEME.colors.border,
  },
  dark: {
    backgroundColor: RUNABLE_THEME.colors.xpBlue,
    borderColor: RUNABLE_THEME.colors.border,
  },
  pressed: {
    transform: [{ translateY: 1 }],
    backgroundColor: RUNABLE_THEME.colors.windowGray,
  },
});
