import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { LeaderboardEntry } from '@/src/types';

type LeaderboardRowProps = {
  entry: LeaderboardEntry;
  highlighted?: boolean;
};

export function LeaderboardRow({ entry, highlighted }: LeaderboardRowProps) {
  return (
    <View style={[styles.row, highlighted ? styles.highlighted : null]}>
      <View style={styles.rank}>
        <ThemedText type="defaultSemiBold">#{entry.rank}</ThemedText>
      </View>
      <View style={styles.body}>
        <ThemedText type="defaultSemiBold">{entry.displayName}</ThemedText>
        <ThemedText>{entry.points}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: RUNABLE_THEME.spacing.sm,
    alignItems: 'center',
    padding: RUNABLE_THEME.spacing.sm,
    borderRadius: RUNABLE_THEME.radii.sm,
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
    ...RUNABLE_THEME.shadows.soft,
  },
  rank: {
    width: 36,
    alignItems: 'center',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: RUNABLE_THEME.spacing.xs,
  },
  highlighted: {
    backgroundColor: RUNABLE_THEME.colors.cream,
    borderColor: RUNABLE_THEME.colors.campusGreen,
  },
});
