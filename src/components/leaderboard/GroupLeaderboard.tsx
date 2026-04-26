import { StyleSheet, View } from 'react-native';

import { LeaderboardRow } from '@/src/components/leaderboard/LeaderboardRow';
import type { LeaderboardEntry } from '@/src/types';

type GroupLeaderboardProps = {
  entries: LeaderboardEntry[];
  currentGroupId?: string;
};

export function GroupLeaderboard({ entries, currentGroupId }: GroupLeaderboardProps) {
  return (
    <View style={styles.container}>
      {entries.map((entry) => (
        <LeaderboardRow
          key={entry.entityId}
          entry={entry}
          highlighted={entry.entityId === currentGroupId}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
