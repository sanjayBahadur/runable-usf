import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { PixelChip, RunableCard } from '@/src/components/ui';

type OffCampusBannerProps = {
  message: string;
};

export function OffCampusBanner({ message }: OffCampusBannerProps) {
  return (
    <RunableCard>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="defaultSemiBold">Preview Mode</ThemedText>
          <PixelChip label="Campus lock" tone="gold" />
        </View>
        <ThemedText style={styles.copy}>{message}</ThemedText>
      </View>
    </RunableCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: RUNABLE_THEME.spacing.sm,
  },
  copy: {
    color: RUNABLE_THEME.colors.ink,
  },
});
