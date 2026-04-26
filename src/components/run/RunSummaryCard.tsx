import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PixelChip, StatTile } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { ClosedLoopResult, RunSession } from '@/src/types';

type RunSummaryCardProps = {
  runSession: RunSession;
  loopResult: ClosedLoopResult;
  invalidReasons: string[];
  claimedCellCount: number;
};

function formatDistance(distanceMeters: number): string {
  return distanceMeters >= 1000
    ? `${(distanceMeters / 1000).toFixed(2)} km`
    : `${Math.round(distanceMeters)} m`;
}

function formatDuration(startedAt: string, endedAt?: string | null): string {
  if (!endedAt) return '0:00';
  const durationMs = new Date(endedAt).getTime() - new Date(startedAt).getTime();
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function RunSummaryCard({
  runSession,
  loopResult,
  invalidReasons,
  claimedCellCount,
}: RunSummaryCardProps) {
  const isValid = loopResult.passesRules;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="subtitle">{isValid ? '✅ Loop Valid' : '⚠️ Loop Invalid'}</ThemedText>
        <PixelChip label={isValid ? 'Claimed!' : 'Needs Work'} tone={isValid ? 'green' : 'gold'} />
      </View>

      {/* Run stats */}
      <View style={styles.statsRow}>
        <StatTile label="Distance" value={formatDistance(loopResult.totalDistanceMeters)} />
        <StatTile label="Duration" value={formatDuration(runSession.startedAt, runSession.endedAt)} />
        <StatTile label="Area" value={`${Math.round(loopResult.enclosedAreaSquareMeters)} m²`} />
      </View>

      {isValid ? (
        <View style={styles.claimInfo}>
          <ThemedText type="defaultSemiBold" style={styles.claimText}>
            🏁 Claimed {claimedCellCount} cell{claimedCellCount !== 1 ? 's' : ''} for your group
          </ThemedText>
          <ThemedText style={styles.hintText}>
            You can edit the colors of your newly captured grid areas directly inside the groups feed tab.
          </ThemedText>
        </View>
      ) : (
        <View style={styles.reasons}>
          <ThemedText type="defaultSemiBold">What went wrong:</ThemedText>
          {invalidReasons.map((reason) => (
            <ThemedText key={reason}>{`• ${reason}`}</ThemedText>
          ))}
        </View>
      )}
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
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: RUNABLE_THEME.spacing.sm,
  },
  claimInfo: {
    gap: 8,
    padding: RUNABLE_THEME.spacing.sm,
    backgroundColor: RUNABLE_THEME.colors.cream,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 1,
    borderColor: RUNABLE_THEME.colors.campusGreen,
  },
  claimText: {
    color: RUNABLE_THEME.colors.campusGreen,
  },
  hintText: {
    fontSize: RUNABLE_THEME.fontSizes.sm,
    color: RUNABLE_THEME.colors.ink,
  },
  reasons: {
    gap: 4,
  },
});
