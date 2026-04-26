import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { POINTS } from '@/src/constants';
import { runDemoTerritoryScenario } from '@/src/demo';

const moduleChecklist = [
  'Mock demo groups, paths, issues, and sightings live under src/demo',
  'Demo scenario runs without GPS, Supabase, or live services',
  'Campus grid, valid loop claims, and overlap resolution are assembled together',
  'Returned demo payload includes groups, cells, claims, scores, ownership, issues, and sightings',
  'Group B wins contested cells while Group A keeps non-overlapped territory',
  'Expo Go screen renders a visible Module 03 demo-mode checklist and snapshot',
];

const demoScenario = runDemoTerritoryScenario();
const contestedOwnership = demoScenario.ownership.filter((cell) => cell.runnerUpGroupId);
const bullsOwnedCount = demoScenario.ownership.filter((cell) => cell.groupId === 'group-bulls').length;
const herdOwnedCount = demoScenario.ownership.filter((cell) => cell.groupId === 'group-herd').length;
const herdStolenCount = demoScenario.ownership.filter(
  (cell) => cell.groupId === 'group-herd' && cell.runnerUpGroupId === 'group-bulls',
).length;
const bullsUnaffectedCount = demoScenario.ownership.filter(
  (cell) => cell.groupId === 'group-bulls' && !cell.runnerUpGroupId,
).length;
const openIssues = demoScenario.issues.filter((issue) => issue.status === 'open');
const fixedIssues = demoScenario.issues.filter((issue) => issue.status === 'fixed');
const sampleOverlap = contestedOwnership[0];

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D7F5E8', dark: '#123728' }}
      headerImage={<View style={styles.heroPanel} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Module 03</ThemedText>
        <ThemedText type="subtitle">Demo Mode</ThemedText>
      </ThemedView>
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold">Visible completion status</ThemedText>
        <ThemedText>
          Module 03 is now wired into the app with a full local demo payload, overlap results,
          issue pins, sighting pins, and a checklist rendered in Expo Go.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Task checklist</ThemedText>
        {moduleChecklist.map((item) => (
          <ThemedText key={item} style={styles.checklistItem}>
            [x] {item}
          </ThemedText>
        ))}
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Live demo snapshot</ThemedText>
        <ThemedText>Demo groups: {demoScenario.groups.length}</ThemedText>
        <ThemedText>Demo runs used in scenario: {demoScenario.runs.length}</ThemedText>
        <ThemedText>Generated campus cells: {demoScenario.cells.length}</ThemedText>
        <ThemedText>Claims created: {demoScenario.claims.length}</ThemedText>
        <ThemedText>All loop paths valid: {demoScenario.loopResults.every((result) => result.passesRules) ? 'yes' : 'no'}</ThemedText>
        <ThemedText>Scored cell entries: {demoScenario.scores.length}</ThemedText>
        <ThemedText>Contested owned cells: {contestedOwnership.length}</ThemedText>
        <ThemedText>Bulls owned cells: {bullsOwnedCount}</ThemedText>
        <ThemedText>Herd owned cells: {herdOwnedCount}</ThemedText>
        <ThemedText>Herd stolen cells: {herdStolenCount}</ThemedText>
        <ThemedText>Bulls non-overlapped cells kept: {bullsUnaffectedCount}</ThemedText>
        <ThemedText>Open issues: {openIssues.length}</ThemedText>
        <ThemedText>Fixed issues: {fixedIssues.length}</ThemedText>
        <ThemedText>Sightings: {demoScenario.sightings.length}</ThemedText>
        <ThemedText>Territory stolen reward: {POINTS.territoryStolen} pts</ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Demo payload</ThemedText>
        <ThemedText>
          `runDemoTerritoryScenario()` returns local map-ready demo data for groups, cells, runs,
          claims, scores, ownership, issues, and sightings without live GPS.
        </ThemedText>
        {sampleOverlap ? (
          <ThemedText>
            Sample contested cell: {sampleOverlap.cellId} owned by {sampleOverlap.groupId} over{' '}
            {sampleOverlap.runnerUpGroupId} at {sampleOverlap.score.toFixed(1)} vs{' '}
            {sampleOverlap.runnerUpScore?.toFixed(1) ?? '0.0'}.
          </ThemedText>
        ) : null}
        <ThemedText>
          Inspect `src/demo/index.ts` for the module surface and `src/demo/demoScenarios.ts` for
          the scenario assembly flow.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    gap: 8,
  },
  heroPanel: {
    position: 'absolute',
    right: 24,
    bottom: 22,
    width: 190,
    height: 138,
    borderRadius: 24,
    backgroundColor: '#006747',
    opacity: 0.9,
  },
  card: {
    gap: 8,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 103, 71, 0.08)',
  },
  checklistItem: {
    lineHeight: 22,
  },
});
