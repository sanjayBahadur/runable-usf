import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import {
  CAMPUS_CONFIG,
  USF_CAMPUS_NAME,
  USF_BOARD_BOUNDARY,
  USF_INITIAL_REGION,
  USF_PREVIEW_REGION,
} from '@/src/constants';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { PixelToolbar } from '@/src/components/art';
import { CampusGateOverlay, CampusStatusChip, OffCampusBanner } from '@/src/components/campus';
import { IssueCard, IssueForm } from '@/src/components/issues';
import { AppShell, MapOverlayShell } from '@/src/components/layout';
import { CampusMap } from '@/src/components/map';
import { ActionDock, GlossyButton, RunableCard, StatTile, XPWindow } from '@/src/components/ui';
import { runDemoTerritoryScenario } from '@/src/demo';
import { getCampusAccessState, getOffCampusMessage } from '@/src/lib/campus';
import { useIssueReports } from '@/src/hooks/useIssueReports';
import { usePixelArt } from '@/src/hooks/usePixelArt';
import type { Coordinate } from '@/src/types';

const demoScenario = runDemoTerritoryScenario();
const onCampusLocation = CAMPUS_CONFIG.center;
const previewLocation: Coordinate = [28.0575, -82.4358];
const currentUserGroupId = 'group-bulls';
const currentUserId = 'user-bulls-demo';
const paintPalette = ['#F97316', '#0EA5E9', '#FACC15', '#F43F5E', '#22C55E', '#A855F7'];
const demoRunPaths = demoScenario.runs.map((run) => run.path.map((point) => point.coordinate));

export default function HomeScreen() {
  const [simulatedMode, setSimulatedMode] = useState<'campus' | 'preview'>('campus');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [draftIssueCoordinate, setDraftIssueCoordinate] = useState<Coordinate | null>(null);
  const [paintModeActive, setPaintModeActive] = useState(false);
  const [campusGateMessage, setCampusGateMessage] = useState<string | null>(null);

  const simulatedUserLocation = simulatedMode === 'campus' ? onCampusLocation : previewLocation;
  const accessState = getCampusAccessState(simulatedUserLocation);
  const previewModeActive = accessState !== 'onCampus';
  const initialRegion = previewModeActive ? USF_PREVIEW_REGION : USF_INITIAL_REGION;
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

  const selectedIssue = useMemo(
    () => issues.find((entry) => entry.id === selectedIssueId) ?? null,
    [issues, selectedIssueId],
  );

  const openIssues = issues.filter((issue) => issue.status === 'open');
  const fixedIssues = issues.filter((issue) => issue.status === 'fixed');

  function showSelection(message: string) {
    setSelectedMessage(message);
  }

  function requireCampusForAction(message: string): boolean {
    if (!previewModeActive) {
      return false;
    }

    setCampusGateMessage(message);
    showSelection(message);
    return true;
  }

  function handleCellPress(cellId: string) {
    if (!paintModeActive) {
      showSelection(`Selected ${cellId}. Enable Paint to color owned cells.`);
      return;
    }

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

    setPaintModeActive(false);
    setDraftIssueCoordinate(null);
    setSelectedIssueId(issueId);
    showSelection(`Issue selected: ${issue.title} (${issue.status}, ${issue.category}).`);
  }

  function handleMapLongPress(coordinate: Coordinate) {
    if (
      requireCampusForAction(
        'Issue reporting is campus-first. Preview mode still lets you inspect the board, pins, and demo territory.',
      )
    ) {
      return;
    }

    setPaintModeActive(false);
    setSelectedIssueId(null);
    setDraftIssueCoordinate(coordinate);
    showSelection(
      `Issue draft opened at ${coordinate[0].toFixed(4)}, ${coordinate[1].toFixed(4)}.`,
    );
  }

  function handleReportIssue(input: Parameters<typeof reportIssue>[0]) {
    const result = reportIssue(input);
    setDraftIssueCoordinate(null);
    setPaintModeActive(false);
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

    setPaintModeActive(false);
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

    setPaintModeActive(false);
    setSelectedIssueId(null);
    setDraftIssueCoordinate(null);
    showSelection(`Sighting: ${sighting.title} (${sighting.category}).`);
    Alert.alert(sighting.title, sighting.description ?? 'No description provided.');
  }

  function toggleSimulatedMode() {
    setCampusGateMessage(null);
    setPaintModeActive(false);
    setSelectedIssueId(null);
    setDraftIssueCoordinate(null);
    setSimulatedMode((existing) => (existing === 'campus' ? 'preview' : 'campus'));
  }

  function togglePaintMode() {
    if (
      requireCampusForAction(
        'Painting is campus-only right now. Continue exploring in preview mode or switch back to campus mode.',
      )
    ) {
      return;
    }

    setSelectedIssueId(null);
    setDraftIssueCoordinate(null);
    setPaintModeActive((current) => {
      const next = !current;
      showSelection(
        next
          ? `${currentGroupName} can paint owned cells only. Tap a cell to paint it.`
          : 'Paint mode closed.',
      );
      return next;
    });
  }

  function closePanel() {
    setPaintModeActive(false);
    setSelectedIssueId(null);
    setDraftIssueCoordinate(null);
  }

  function promptIssuePinning() {
    if (
      requireCampusForAction(
        'Issue reporting is currently gated to campus mode. Preview mode still lets you inspect the board and demo pins.',
      )
    ) {
      return;
    }

    setPaintModeActive(false);
    setSelectedIssueId(null);
    setDraftIssueCoordinate(null);
    showSelection('Long press the board to pin a new issue report.');
  }

  const panelVisible = paintModeActive || Boolean(draftIssueCoordinate) || Boolean(selectedIssue);

  return (
    <AppShell>
      <SafeAreaView style={styles.screen} edges={['left', 'right']}>
        <View style={styles.mapWrap}>
          <CampusMap
            boardBoundary={USF_BOARD_BOUNDARY}
            userLocation={simulatedUserLocation}
            runPath={demoRunPaths}
            initialRegion={initialRegion}
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

        <MapOverlayShell
          top={
            <>
              <View style={styles.topRow}>
                <CampusStatusChip campusName={USF_CAMPUS_NAME} accessState={accessState} />
                <GlossyButton
                  label={simulatedMode === 'campus' ? 'Preview' : 'Campus'}
                  onPress={toggleSimulatedMode}
                  tone="secondary"
                  compact
                />
              </View>
              <RunableCard>
                <View style={styles.metricRow}>
                  <StatTile label="Open" value={openIssues.length} />
                  <StatTile label="Fixed" value={fixedIssues.length} />
                  <StatTile label="Painted" value={visibleCellArt.length} />
                </View>
              </RunableCard>
              {previewModeActive ? <OffCampusBanner message={getOffCampusMessage(accessState)} /> : null}
            </>
          }
          toast={
            selectedMessage ? (
              <XPWindow variant="dark">
                <ThemedText lightColor="#F8FAFC" darkColor="#F8FAFC">
                  {selectedMessage}
                </ThemedText>
              </XPWindow>
            ) : null
          }
          panel={
            panelVisible ? (
              <XPWindow
                title={draftIssueCoordinate ? 'Report Issue' : selectedIssue ? 'Issue Details' : 'Paint'}
                icon={draftIssueCoordinate ? '+' : selectedIssue ? 'i' : 'P'}
                action={<GlossyButton label="Close" onPress={closePanel} tone="secondary" compact />}>
                <ScrollView contentContainerStyle={styles.panelBody} showsVerticalScrollIndicator={false}>
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
                  ) : paintModeActive ? (
                    <PixelToolbar
                      colors={paintPalette}
                      selectedColor={selectedColor}
                      paintedCount={visibleCellArt.length}
                      currentGroupName={currentGroupName}
                      onSelectColor={setSelectedColor}
                    />
                  ) : null}
                </ScrollView>
              </XPWindow>
            ) : null
          }
          dock={
            <ActionDock
              actions={[
                {
                  label: 'Demo Run',
                  onPress: () => showSelection('Demo run paths are already visible on the board.'),
                  tone: 'secondary',
                },
                { label: 'Report', onPress: promptIssuePinning, tone: 'primary' },
                {
                  label: 'Sighting',
                  onPress: () => showSelection('Tap a sighting pin to inspect demo sightings.'),
                  tone: 'secondary',
                },
                {
                  label: 'Paint',
                  onPress: togglePaintMode,
                  tone: paintModeActive ? 'danger' : 'primary',
                },
              ]}
            />
          }
          gate={
            campusGateMessage ? (
              <CampusGateOverlay
                message={campusGateMessage}
                onDismiss={() => setCampusGateMessage(null)}
              />
            ) : null
          }
        />
      </SafeAreaView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  mapWrap: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: RUNABLE_THEME.spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: RUNABLE_THEME.spacing.sm,
  },
  panelBody: {
    gap: RUNABLE_THEME.spacing.sm,
    paddingBottom: 4,
  },
});
