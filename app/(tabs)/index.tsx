import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CAMPUS_CONFIG, POINTS } from '@/src/constants';
import { PixelToolbar } from '@/src/components/art';
import { CampusMap } from '@/src/components/map';
import { runDemoTerritoryScenario } from '@/src/demo';
import { usePixelArt } from '@/src/hooks/usePixelArt';

const moduleChecklist = [
  'Pixel art rules only allow painting currently owned cells',
  'A color picker and paint toolbar render above the live map',
  'Tapping owned cells paints them with the selected color',
  'Rival-owned cells reject paint attempts',
  'Painted cells appear as a separate overlay on the map',
  'Expo Go shows a visible Module 05 checklist and working paint flow',
];

const demoScenario = runDemoTerritoryScenario();
const currentUserGroupId = 'group-bulls';
const currentUserId = 'user-bulls-demo';
const paintPalette = ['#F97316', '#0EA5E9', '#FACC15', '#F43F5E', '#22C55E', '#A855F7'];
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
  const currentGroupName =
    demoScenario.groups.find((group) => group.id === currentUserGroupId)?.name ?? currentUserGroupId;
  const { selectedColor, setSelectedColor, visibleCellArt, paintCell } = usePixelArt({
    userGroupId: currentUserGroupId,
    userId: currentUserId,
    ownership: demoScenario.ownership,
  });
  const [selectedMessage, setSelectedMessage] = useState(
    'Select a color, then tap one of the Bulls-owned cells to paint it.',
  );

  function showSelection(message: string) {
    setSelectedMessage(message);
  }

  function handleCellPress(cellId: string) {
    const cellOwnership = demoScenario.ownership.find((cell) => cell.cellId === cellId);
    if (!cellOwnership) {
      return;
    }

    const paintResult = paintCell(cellId);

    if (paintResult.painted) {
      showSelection(`Painted ${cellId} with ${selectedColor} for ${currentGroupName}.`);
      return;
    }

    const groupName =
      demoScenario.groups.find((group) => group.id === cellOwnership.groupId)?.name ??
      cellOwnership.groupId;
    showSelection(
      `Cannot paint ${cellId}. ${groupName} owns it at score ${cellOwnership.score.toFixed(1)}.`,
    );
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
          cellArt={visibleCellArt}
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
            <ThemedText type="title">Module 05</ThemedText>
            <ThemedText type="subtitle">Pixel Art Layer</ThemedText>
          </View>

          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">Visible completion status</ThemedText>
            <ThemedText>
              Module 05 now adds cell-based painting on top of the demo map, with local art state,
              ownership checks, a color picker, and a live checklist overlay in Expo Go.
            </ThemedText>
          </View>

          <PixelToolbar
            colors={paintPalette}
            selectedColor={selectedColor}
            paintedCount={visibleCellArt.length}
            currentGroupName={currentGroupName}
            onSelectColor={setSelectedColor}
          />

          <View style={styles.card}>
            <ThemedText type="subtitle">Task checklist</ThemedText>
            {moduleChecklist.map((item) => (
              <ThemedText key={item} style={styles.checklistItem}>
                [x] {item}
              </ThemedText>
            ))}
          </View>

          <View style={styles.card}>
            <ThemedText type="subtitle">Live paint snapshot</ThemedText>
            <ThemedText>Groups rendered: {demoScenario.groups.length}</ThemedText>
            <ThemedText>Map cells rendered: {demoScenario.ownership.length}</ThemedText>
            <ThemedText>Contested cells visible: {contestedOwnership.length}</ThemedText>
            <ThemedText>Current painting group: {currentGroupName}</ThemedText>
            <ThemedText>Selected color: {selectedColor}</ThemedText>
            <ThemedText>Painted cells visible: {visibleCellArt.length}</ThemedText>
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
            onPress={() =>
              setSelectedMessage('Select a color, then tap one of the Bulls-owned cells to paint it.')
            }
            style={({ pressed }) => [
              styles.selectionCard,
              {
                backgroundColor: pressed
                  ? `${Colors[colorScheme].tabIconDefault}22`
                  : 'rgba(37, 99, 235, 0.08)',
              },
            ]}>
            <ThemedText type="subtitle">Paint Status</ThemedText>
            <ThemedText>{selectedMessage}</ThemedText>
            {sampleOverlap ? (
              <ThemedText>
                Sample overlap: {sampleOverlap.cellId} {sampleOverlap.groupId} over{' '}
                {sampleOverlap.runnerUpGroupId}.
              </ThemedText>
            ) : null}
            <ThemedText>
              Bulls can paint their owned cells only. Try a Bulls cell first, then try a Herd cell.
            </ThemedText>
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
    maxHeight: '52%',
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
    marginBottom: 6,
  },
});
