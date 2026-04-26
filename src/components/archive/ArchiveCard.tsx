import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { ArchiveSnapshot } from '@/src/types';
import { WinnerBanner } from './WinnerBanner';
import { ArchivedMapPreview } from './ArchivedMapPreview';
import { FontAwesome5 } from '@expo/vector-icons';

type ArchiveCardProps = {
  snapshot: ArchiveSnapshot;
  groupName: string;
};

export function ArchiveCard({ snapshot, groupName }: ArchiveCardProps) {
  const dateStr = new Date(snapshot.date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.date}>
          {dateStr}
        </ThemedText>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>{snapshot.cycle}</ThemedText>
        </View>
      </View>

      <WinnerBanner 
        winnerName={groupName} 
        cycle={snapshot.cycle} 
        period={snapshot.period} 
      />

      <ArchivedMapPreview 
        totalCells={256} // Fixed for demo or calculate from entries
        winnerCells={snapshot.totalCellsOwned}
        ownership={snapshot.ownershipSnapshot}
      />

      <View style={styles.metricsGrid}>
        <Metric 
          icon="check-circle" 
          label="Issues" 
          value={snapshot.totalIssuesFixed} 
          color="#10B981" 
        />
        <Metric 
          icon="eye" 
          label="Sightings" 
          value={snapshot.totalSightings} 
          color="#3B82F6" 
        />
        <Metric 
          icon="star" 
          label="Score" 
          value={snapshot.winnerScore} 
          color="#F59E0B" 
        />
      </View>
    </View>
  );
}

function Metric({ icon, label, value, color }: { icon: string; label: string; value: number | string; color: string }) {
  return (
    <View style={styles.metric}>
      <FontAwesome5 name={icon} size={12} color={color} />
      <View>
        <ThemedText style={styles.metricValue}>{value}</ThemedText>
        <ThemedText style={styles.metricLabel}>{label}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RUNABLE_THEME.radii.md,
    padding: RUNABLE_THEME.spacing.md,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: RUNABLE_THEME.spacing.sm,
    ...RUNABLE_THEME.shadows.soft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#64748B',
  },
  badge: {
    backgroundColor: RUNABLE_THEME.colors.xpBlue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RUNABLE_THEME.spacing.xs,
    paddingTop: RUNABLE_THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: RUNABLE_THEME.colors.ink,
  },
  metricLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
