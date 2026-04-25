import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { GROUP_COLORS, POINTS, STATUS_COLORS } from '@/src/constants';

const typeFiles = [
  'common.ts',
  'user.ts',
  'group.ts',
  'run.ts',
  'territory.ts',
  'issue.ts',
  'sighting.ts',
  'feed.ts',
  'art.ts',
  'leaderboard.ts',
  'period.ts',
  'index.ts',
];

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F6EAD7', dark: '#3D2C11' }}
      headerImage={<View style={styles.headerBlock} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Shared Vocabulary
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Module 00 defines the base entities and rule constants the later geometry, territory, demo,
        and map modules will import.
      </ThemedText>
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Type files</ThemedText>
        {typeFiles.map((file) => (
          <ThemedText key={file}>src/types/{file}</ThemedText>
        ))}
      </ThemedView>
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Color tokens</ThemedText>
        <ThemedText>Bulls green: {GROUP_COLORS.bulls}</ThemedText>
        <ThemedText>Issue open: {STATUS_COLORS.issueOpen}</ThemedText>
        <ThemedText>Issue fixed: {STATUS_COLORS.issueFixed}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Scoring examples</ThemedText>
        <ThemedText>Issue fixed: {POINTS.issueFixed} pts</ThemedText>
        <ThemedText>Rival issue fixed: {POINTS.rivalIssueFixed} pts</ThemedText>
        <ThemedText>Territory stolen: {POINTS.territoryStolen} pts</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    position: 'absolute',
    bottom: 24,
    left: 28,
    width: 220,
    height: 124,
    borderRadius: 24,
    backgroundColor: '#CFC493',
  },
  titleContainer: {
    gap: 8,
  },
  card: {
    gap: 8,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(207, 196, 147, 0.16)',
  },
});
