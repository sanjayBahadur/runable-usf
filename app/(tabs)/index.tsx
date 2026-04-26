import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CAMPUS_CONFIG, POINTS } from '@/src/constants';
import { PixelToolbar } from '@/src/components/art';
import { IssueCard, IssueForm } from '@/src/components/issues';
import { CampusMap } from '@/src/components/map';
import { runDemoTerritoryScenario } from '@/src/demo';
import { useIssueReports } from '@/src/hooks/useIssueReports';
import { usePixelArt } from '@/src/hooks/usePixelArt';
import type { Coordinate } from '@/src/types';

const demoScenario = runDemoTerritoryScenario();
const currentUserGroupId = 'group-bulls';
const currentUserId = 'user-bulls-demo';
const paintPalette = ['#F97316', '#0EA5E9', '#FACC15', '#F43F5E', '#22C55E', '#A855F7'];
const demoRunPaths = demoScenario.runs.map((run) => run.path.map((point) => point.coordinate));
const demoUserLocation = CAMPUS_CONFIG.center;

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const currentGroupName =
    demoScenario.groups.find((group) => group.id === currentUserGroupId)?.name ?? currentUserGroupId;
  const { issues, reportIssue, markIssueFixed } = useIssueReports({
    initialIssues: demoScenario.issues,
    currentUserId,
    currentUserGroupId,
  });
  const { selectedColor, setSelectedColor, visibleCellArt, paintCell } = usePixelArt({
    userGroupId: currentUserGroupId,
    userId: currentUserId,
    ownership: demoScenario.ownership,
  });
  const [selectedMessage, setSelectedMessage] = useState(
    'Long press the map to report an issue, tap a red pin to fix it, or paint a Bulls-owned cell.',
  );
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(issues[0]?.id ?? null);
  const [draftIssueCoordinate, setDraftIssueCoordinate] = useState<Coordinate | null>(null);

  const selectedIssue = useMemo(
    () => issues.find((entry) => entry.id === selectedIssueId) ?? issues[0] ?? null,
    [issues, selectedIssueId],
  );

  const openIssues = issues.filter((issue) => issue.status === 'open');
  const fixedIssues = issues.filter((issue) => issue.status === 'fixed');
  const contestedOwnership = demoScenario.ownership.filter((cell) => cell.runnerUpGroupId);
  const bullsOwnedCount = demoScenario.ownership.filter((cell) => cell.groupId === 'group-bulls').length;
  const herdOwnedCount = demoScenario.ownership.filter((cell) => cell.groupId === 'group-herd').length;

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
    showSelection(`Cannot paint ${cellId}. ${groupName} owns that cell.`);
  }

  function handleIssuePress(issueId: string) {
    const issue = issues.find((entry) => entry.id === issueId);
    if (!issue) {
      return;
    }

    setDraftIssueCoordinate(null);
    setSelectedIssueId(issueId);
    showSelection(`Issue selected: ${issue.title} (${issue.status}, ${issue.category}).`);
  }

  function handleMapLongPress(coordinate: Coordinate) {
    setDraftIssueCoordinate(coordinate);
    showSelection(
      `Issue draft opened at ${coordinate[0].toFixed(4)}, ${coordinate[1].toFixed(4)}.`,
    );
  }

  function handleReportIssue(input: Parameters<typeof reportIssue>[0]) {
    const result = reportIssue(input);
    setDraftIssueCoordinate(null);
    setSelectedIssueId(result.issue.id);
    showSelection(
      `Reported "${result.issue.title}" for ${result.pointsAwarded} pts. Pin added in red.`,
    );
    Alert.alert('Issue reported', `${result.issue.title} added for ${result.pointsAwarded} pts.`);
  }

  function handleFixIssue(issueId: string, afterPhotoUri?: string) {
    const result = markIssueFixed(issueId, afterPhotoUri);
    if (!result) {
      return;
    }

    setSelectedIssueId(result.issue.id);
    showSelection(
      `Fixed "${result.issue.title}" for ${result.pointsAwarded} pts. Pin turned green.`,
    );
    Alert.alert('Issue fixed', `${result.issue.title} fixed for ${result.pointsAwarded} pts.`);
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
          issues={issues}
          sightings={demoScenario.sightings}
          groups={demoScenario.groups}
          onCellPress={handleCellPress}
          onIssuePress={handleIssuePress}
          onSightingPress={handleSightingPress}
          onMapLongPress={handleMapLongPress}
        />
      </View>

      <View style={styles.topHud}>
        <View
          style={[
            styles.hudCard,
            {
              backgroundColor:
                colorScheme === 'dark' ? 'rgba(21, 23, 24, 0.92)' : 'rgba(255, 255, 255, 0.94)',
            },
          ]}>
          <ThemedText type="defaultSemiBold">Runable Demo Map</ThemedText>
          <ThemedText>
            Long press anywhere on campus to report an issue at that exact location.
          </ThemedText>
          <View style={styles.metricRow}>
            <View style={styles.metricChip}>
              <ThemedText>Open {openIssues.length}</ThemedText>
            </View>
            <View style={styles.metricChip}>
              <ThemedText>Fixed {fixedIssues.length}</ThemedText>
            </View>
            <View style={styles.metricChip}>
              <ThemedText>Painted {visibleCellArt.length}</ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.bottomSheet,
          {
            backgroundColor:
              colorScheme === 'dark' ? 'rgba(21, 23, 24, 0.96)' : 'rgba(255, 255, 255, 0.96)',
          },
        ]}>
        <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          <PixelToolbar
            colors={paintPalette}
            selectedColor={selectedColor}
            paintedCount={visibleCellArt.length}
            currentGroupName={currentGroupName}
            onSelectColor={setSelectedColor}
          />

          {draftIssueCoordinate ? (
            <IssueForm
              coordinate={draftIssueCoordinate}
              onCancel={() => {
                setDraftIssueCoordinate(null);
                showSelection('Issue draft canceled.');
              }}
              onSubmit={handleReportIssue}
            />
          ) : selectedIssue ? (
            <IssueCard issue={selectedIssue} onFixIssue={handleFixIssue} />
          ) : null}

          <View style={styles.statsCard}>
            <ThemedText type="defaultSemiBold">Field Status</ThemedText>
            <ThemedText>{selectedMessage}</ThemedText>
            <ThemedText>
              Bulls cells: {bullsOwnedCount} | Herd cells: {herdOwnedCount} | Contested:{' '}
              {contestedOwnership.length}
            </ThemedText>
            <ThemedText>
              Report {POINTS.issueReported} pts | Fix {POINTS.issueFixed} pts
            </ThemedText>
            <ThemedText>Module history stays in the Development Log tab.</ThemedText>
          </View>
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
  topHud: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
  },
  hudCard: {
    gap: 10,
    padding: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
  },
  bottomSheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    maxHeight: '46%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  sheetContent: {
    gap: 12,
    padding: 18,
  },
  statsCard: {
    gap: 8,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 103, 71, 0.08)',
  },
});
