import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PixelChip, StatTile } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { RunTrackerStatus } from '@/src/hooks/useRunTracker';

type RunStatsPanelProps = {
  status: RunTrackerStatus;
  distanceMeters: number;
  elapsedSeconds: number;
  pointCount: number;
};

function formatDistance(distanceMeters: number): string {
  return distanceMeters >= 1000
    ? `${(distanceMeters / 1000).toFixed(2)} km`
    : `${Math.round(distanceMeters)} m`;
}

function formatElapsed(elapsedSeconds: number): string {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function getStatusChipTone(status: RunTrackerStatus): 'green' | 'gold' | 'blue' | 'neutral' {
  switch (status) {
    case 'recording':
      return 'green';
    case 'paused':
      return 'gold';
    case 'finished':
      return 'blue';
    default:
      return 'neutral';
  }
}

export function RunStatsPanel({
  status,
  distanceMeters,
  elapsedSeconds,
  pointCount,
}: RunStatsPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">Live Run</ThemedText>
        <PixelChip label={status} tone={getStatusChipTone(status)} />
      </View>
      <View style={styles.tiles}>
        <StatTile label="Distance" value={formatDistance(distanceMeters)} />
        <StatTile label="Elapsed" value={formatElapsed(elapsedSeconds)} />
        <StatTile label="Points" value={pointCount} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: RUNABLE_THEME.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: RUNABLE_THEME.spacing.sm,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: RUNABLE_THEME.spacing.sm,
  },
});
