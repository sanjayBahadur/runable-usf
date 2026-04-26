import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';

type StatTileProps = {
  label: string;
  value: string | number;
};

export function StatTile({ label, value }: StatTileProps) {
  return (
    <View style={styles.tile}>
      <ThemedText type="defaultSemiBold" style={styles.value}>
        {value}
      </ThemedText>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    minWidth: 72,
    paddingHorizontal: RUNABLE_THEME.spacing.sm,
    paddingVertical: RUNABLE_THEME.spacing.sm,
    borderRadius: RUNABLE_THEME.radii.sm,
    backgroundColor: RUNABLE_THEME.colors.cream,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
  },
  value: {
    fontSize: RUNABLE_THEME.fontSizes.lg,
    lineHeight: 22,
  },
  label: {
    fontSize: RUNABLE_THEME.fontSizes.xs,
    lineHeight: 16,
    color: RUNABLE_THEME.colors.mutedInk,
  },
});
