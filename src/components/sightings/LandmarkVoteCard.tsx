import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GlossyButton } from '@/src/components/ui';
import { SightingCard } from '@/src/components/sightings/SightingCard';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { Sighting } from '@/src/types';

type LandmarkVoteCardProps = {
  sighting: Sighting;
};

type VoteName = {
  name: string;
  votes: number;
};

export function LandmarkVoteCard({ sighting }: LandmarkVoteCardProps) {
  const [votedName, setVotedName] = useState<string | null>(null);

  // Mock initial votes based on the landmark ID or title
  const [candidates, setCandidates] = useState<VoteName[]>([
    { name: sighting.title, votes: 12 },
    { name: 'The Bull Pen', votes: 4 },
  ]);

  function handleVote(name: string) {
    if (votedName) return; // one vote per session for MVP
    setVotedName(name);
    setCandidates((prev) =>
      prev.map((c) => (c.name === name ? { ...c, votes: c.votes + 1 } : c)),
    );
  }

  return (
    <View style={styles.container}>
      <SightingCard sighting={sighting} />

      <View style={styles.voteSection}>
        <ThemedText type="defaultSemiBold" style={{ color: RUNABLE_THEME.colors.ink }}>
          🗳️ Landmark Name Voting
        </ThemedText>
        <ThemedText style={styles.description}>
          Help the community agree on a recognizable name for this marker.
        </ThemedText>

        <View style={styles.candidates}>
          {candidates.map((candidate) => (
            <View key={candidate.name} style={styles.candidateRow}>
              <View style={styles.candidateInfo}>
                <ThemedText style={{ color: RUNABLE_THEME.colors.ink, fontWeight: 'bold' }}>
                  {candidate.name}
                </ThemedText>
                <ThemedText style={styles.voteCount}>{candidate.votes} votes</ThemedText>
              </View>

              <GlossyButton
                label={votedName === candidate.name ? 'Voted' : 'Vote'}
                compact
                tone={votedName === candidate.name ? 'primary' : 'secondary'}
                onPress={() => handleVote(candidate.name)}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: RUNABLE_THEME.spacing.md,
  },
  voteSection: {
    gap: RUNABLE_THEME.spacing.sm,
    padding: RUNABLE_THEME.spacing.sm,
    backgroundColor: RUNABLE_THEME.colors.cream,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: RUNABLE_THEME.radii.md,
  },
  description: {
    fontSize: RUNABLE_THEME.fontSizes.sm,
    color: '#334155',
  },
  candidates: {
    gap: RUNABLE_THEME.spacing.xs,
  },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: RUNABLE_THEME.colors.paper,
    padding: RUNABLE_THEME.spacing.sm,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 1,
    borderColor: RUNABLE_THEME.colors.border,
  },
  candidateInfo: {
    flex: 1,
  },
  voteCount: {
    fontSize: RUNABLE_THEME.fontSizes.xs,
    color: '#64748B',
  },
});
