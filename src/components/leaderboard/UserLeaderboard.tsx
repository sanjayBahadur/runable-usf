import { StyleSheet, View } from 'react-native';

import { LeaderboardRow } from '@/src/components/leaderboard/LeaderboardRow';
import type { LeaderboardEntry } from '@/src/types';

type UserLeaderboardProps = {
  entries: LeaderboardEntry[];
  currentUserId?: string;
};

export function UserLeaderboard({ entries, currentUserId }: UserLeaderboardProps) {
  return (
    <View style={styles.container}>
      {entries.map((entry) => (
        <LeaderboardRow
          key={entry.entityId}
          entry={entry}
          highlighted={entry.entityId === currentUserId}
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
