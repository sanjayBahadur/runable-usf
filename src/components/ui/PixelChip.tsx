import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';

type PixelChipProps = {
  label: string;
  tone?: 'neutral' | 'green' | 'gold' | 'blue' | 'dark';
};

export function PixelChip({ label, tone = 'neutral' }: PixelChipProps) {
  return (
    <View style={[styles.chip, styles[tone]]}>
      <ThemedText
        type="defaultSemiBold"
        style={styles.text}
        lightColor={tone === 'dark' ? '#F8FAFC' : RUNABLE_THEME.colors.ink}
        darkColor={tone === 'dark' ? '#F8FAFC' : RUNABLE_THEME.colors.ink}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: RUNABLE_THEME.spacing.sm,
    paddingVertical: RUNABLE_THEME.spacing.xs,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 1.5,
  },
  neutral: {
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderColor: RUNABLE_THEME.colors.border,
  },
  green: {
    backgroundColor: '#D9F4E7',
    borderColor: RUNABLE_THEME.colors.border,
  },
  gold: {
    backgroundColor: '#FFF0B8',
    borderColor: RUNABLE_THEME.colors.border,
  },
  blue: {
    backgroundColor: '#D6E6FF',
    borderColor: RUNABLE_THEME.colors.border,
  },
  dark: {
    backgroundColor: RUNABLE_THEME.colors.xpBlue,
    borderColor: RUNABLE_THEME.colors.border,
  },
  text: {
    fontSize: RUNABLE_THEME.fontSizes.sm,
    lineHeight: 18,
  },
});
