import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { LeaderboardEntry } from '@/src/types';

type LeaderboardRowProps = {
  entry: LeaderboardEntry;
  highlighted?: boolean;
};

export function LeaderboardRow({ entry, highlighted }: LeaderboardRowProps) {
  return (
    <View style={[styles.row, highlighted ? styles.highlighted : undefined]}>
      <ThemedText type="defaultSemiBold">#{entry.rank}</ThemedText>
      <View style={styles.body}>
        <ThemedText>{entry.displayName}</ThemedText>
        <ThemedText>{entry.points}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  highlighted: {
    backgroundColor: 'rgba(0, 103, 71, 0.12)',
  },
});
