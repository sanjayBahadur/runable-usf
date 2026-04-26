import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { PixelChip } from '@/src/components/ui/PixelChip';

type ArchivedMapPreviewProps = {
  totalCells: number;
  winnerCells: number;
  ownership: Record<string, string>;
};

export function ArchivedMapPreview({ totalCells, winnerCells, ownership }: ArchivedMapPreviewProps) {
  // Simple visualization: Percentage of map captured
  const percentage = Math.round((winnerCells / (totalCells || 1)) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.statRow}>
        <ThemedText style={styles.label}>Territory Control</ThemedText>
        <PixelChip label={`${percentage}%`} tone="green" />
      </View>
      <View style={styles.miniMap}>
        {/* Abstract representation of dominance */}
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
      <ThemedText style={styles.hint}>
        Winner captured {winnerCells} of the available cells during this cycle.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: RUNABLE_THEME.spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
    borderRadius: RUNABLE_THEME.radii.sm,
    gap: RUNABLE_THEME.spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#64748B',
  },
  miniMap: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
  },
  fill: {
    height: '100%',
    backgroundColor: RUNABLE_THEME.colors.campusGreen,
  },
  hint: {
    fontSize: 10,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
});
