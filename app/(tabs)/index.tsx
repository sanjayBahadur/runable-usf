import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CAMPUS_CONFIG, POINTS } from '@/src/constants';
import { CampusMap } from '@/src/components/map';
import { runDemoTerritoryScenario } from '@/src/demo';

const moduleChecklist = [
  'Campus boundary renders from shared campus coordinates',
  'Territory cells render in owning group colors',
  'Overlapping ownership from the demo scenario appears on the map',
  'Demo run paths, issues, sightings, and a user marker render together',
  'Map layers stay prop-driven and do not calculate game logic',
  'Expo Go opens to a visible Module 04 checklist and working map',
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
const demoRunPaths = demoScenario.runs.map((run) => run.path.map((point) => point.coordinate));
const demoUserLocation = CAMPUS_CONFIG.center;

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [selectedMessage, setSelectedMessage] = useState(
    'Tap a territory cell, issue pin, or sighting pin.',
  );

  function showSelection(message: string) {
    setSelectedMessage(message);
  }

  function handleCellPress(cellId: string) {
    const cellOwnership = demoScenario.ownership.find((cell) => cell.cellId === cellId);
    if (!cellOwnership) {
      return;
    }

    const groupName =
      demoScenario.groups.find((group) => group.id === cellOwnership.groupId)?.name ?? cellOwnership.groupId;
    showSelection(`Cell ${cellId} is owned by ${groupName} at score ${cellOwnership.score.toFixed(1)}.`);
  }

  function handleIssuePress(issueId: string) {
    const issue = demoScenario.issues.find((entry) => entry.id === issueId);
    if (!issue) {
      return;
    }

    showSelection(`Issue: ${issue.title} (${issue.status}).`);
    Alert.alert(issue.title, issue.description ?? 'No description provided.');
  }

  function handleSightingPress(sightingId: string) {
    const sighting = demoScenario.sightings.find((entry) => entry.id === sightingId);
    if (!sighting) {
      return;
    }

    showSelection(`Sighting: ${sighting.title} (${sighting.category}).`);
    Alert.alert(sighting.title, sighting.description ?? 'No description provided.');
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.mapWrap}>
        <CampusMap
          campusBoundary={CAMPUS_CONFIG.boundary}
          userLocation={demoUserLocation}
          runPath={demoRunPaths}
          cells={demoScenario.cells}
          ownership={demoScenario.ownership}
          issues={demoScenario.issues}
          sightings={demoScenario.sightings}
          groups={demoScenario.groups}
          onCellPress={handleCellPress}
          onIssuePress={handleIssuePress}
          onSightingPress={handleSightingPress}
        />
      </View>
      <View
        style={[
          styles.overlay,
          {
            backgroundColor:
              colorScheme === 'dark' ? 'rgba(21, 23, 24, 0.94)' : 'rgba(255, 255, 255, 0.95)',
          },
        ]}>
        <ScrollView contentContainerStyle={styles.overlayContent} showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <ThemedText type="title">Module 04</ThemedText>
            <ThemedText type="subtitle">Map Rendering</ThemedText>
          </View>

          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">Visible completion status</ThemedText>
            <ThemedText>
              Module 04 now opens to a working demo map with boundary, owned territory, run paths,
              issue pins, sighting pins, and a live checklist overlay in Expo Go.
            </ThemedText>
          </View>

          <View style={styles.card}>
            <ThemedText type="subtitle">Task checklist</ThemedText>
            {moduleChecklist.map((item) => (
              <ThemedText key={item} style={styles.checklistItem}>
                [x] {item}
              </ThemedText>
            ))}
          </View>

          <View style={styles.card}>
            <ThemedText type="subtitle">Live map snapshot</ThemedText>
            <ThemedText>Groups rendered: {demoScenario.groups.length}</ThemedText>
            <ThemedText>Map cells rendered: {demoScenario.ownership.length}</ThemedText>
            <ThemedText>Contested cells visible: {contestedOwnership.length}</ThemedText>
            <ThemedText>Run paths visible: {demoRunPaths.length}</ThemedText>
            <ThemedText>Open issues: {openIssues.length}</ThemedText>
            <ThemedText>Fixed issues: {fixedIssues.length}</ThemedText>
            <ThemedText>Sightings: {demoScenario.sightings.length}</ThemedText>
            <ThemedText>Bulls owned cells: {bullsOwnedCount}</ThemedText>
            <ThemedText>Herd owned cells: {herdOwnedCount}</ThemedText>
            <ThemedText>Herd stolen cells: {herdStolenCount}</ThemedText>
            <ThemedText>Bulls non-overlapped cells kept: {bullsUnaffectedCount}</ThemedText>
            <ThemedText>Territory stolen reward: {POINTS.territoryStolen} pts</ThemedText>
          </View>

          <Pressable
            onPress={() => setSelectedMessage('Tap a territory cell, issue pin, or sighting pin.')}
            style={({ pressed }) => [
              styles.selectionCard,
              {
                backgroundColor: pressed
                  ? `${Colors[colorScheme].tabIconDefault}22`
                  : 'rgba(37, 99, 235, 0.08)',
              },
            ]}>
            <ThemedText type="subtitle">Selection</ThemedText>
            <ThemedText>{selectedMessage}</ThemedText>
            {sampleOverlap ? (
              <ThemedText>
                Sample overlap: {sampleOverlap.cellId} {sampleOverlap.groupId} over{' '}
                {sampleOverlap.runnerUpGroupId}.
              </ThemedText>
            ) : null}
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  mapWrap: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    maxHeight: '47%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  overlayContent: {
    gap: 12,
    padding: 18,
  },
  titleContainer: {
    gap: 8,
  },
  card: {
    gap: 8,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 103, 71, 0.08)',
  },
  checklistItem: {
    lineHeight: 22,
  },
  selectionCard: {
    gap: 8,
    padding: 16,
    borderRadius: 20,
  },
});
