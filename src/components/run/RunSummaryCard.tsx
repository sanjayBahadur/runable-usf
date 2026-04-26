import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PixelChip } from '@/src/components/ui';
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

export function RunSummaryCard({
  runSession,
  loopResult,
  invalidReasons,
  claimedCellCount,
}: RunSummaryCardProps) {
  const isValid = loopResult.passesRules;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">{isValid ? 'Loop Valid' : 'Loop Invalid'}</ThemedText>
        <PixelChip label={isValid ? 'Claim Ready' : 'Needs Work'} tone={isValid ? 'green' : 'gold'} />
      </View>
      <ThemedText>Distance: {formatDistance(loopResult.totalDistanceMeters)}</ThemedText>
      <ThemedText>Area: {Math.round(loopResult.enclosedAreaSquareMeters)} m²</ThemedText>
      <ThemedText>Closing gap: {Math.round(loopResult.closingDistanceMeters)} m</ThemedText>
      <ThemedText>GPS points: {loopResult.pointCount}</ThemedText>
      {isValid ? (
        <ThemedText>Claimed cells added this run: {claimedCellCount}</ThemedText>
      ) : (
        <View style={styles.reasons}>
          {invalidReasons.map((reason) => (
            <ThemedText key={reason}>{`\u2022 ${reason}`}</ThemedText>
          ))}
        </View>
      )}
      <ThemedText>Run status: {runSession.status}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: RUNABLE_THEME.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: RUNABLE_THEME.spacing.sm,
  },
  reasons: {
    gap: 4,
  },
});
