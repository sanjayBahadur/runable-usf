import { useEffect, useMemo, useState } from 'react';
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
import { AuthGate } from '@/src/components/auth';
import { CampusGateOverlay, CampusStatusChip, OffCampusBanner } from '@/src/components/campus';
import { IssueCard, IssueForm } from '@/src/components/issues';
import { SightingCard, SightingForm, LandmarkVoteCard } from '@/src/components/sightings';
import { AppShell, MapOverlayShell } from '@/src/components/layout';
import { CampusMap } from '@/src/components/map';
import { ActiveRunOverlay, RunSummaryCard } from '@/src/components/run';
import { ActionDock, type ActionDockItem, GlossyButton, XPWindow } from '@/src/components/ui';
import { runDemoTerritoryScenario } from '@/src/demo';
import { completeRunClaim, type CompleteRunClaimResult } from '@/src/features/runs';
import { getCampusAccessState, getOffCampusMessage } from '@/src/lib/campus';
import { useAuth } from '@/src/hooks/useAuth';
import { useIssueReports } from '@/src/hooks/useIssueReports';
import { useSightings } from '@/src/hooks/useSightings';
import { usePixelArt } from '@/src/hooks/usePixelArt';
import { useRunTracker } from '@/src/hooks/useRunTracker';
import { useAppStore } from '@/src/store/appStore';
import type { Coordinate } from '@/src/types';

const demoScenario = runDemoTerritoryScenario();
const onCampusLocation = CAMPUS_CONFIG.center;
const previewLocation: Coordinate = [28.0575, -82.4358];
const DEMO_GROUP_ID = 'group-bulls';
const DEMO_USER_ID = 'user-bulls-demo';
const demoRunPaths = demoScenario.runs.map((run) => run.path.map((point) => point.coordinate));

export default function HomeScreen() {
  const auth = useAuth();
  const appMode = useAppStore((s) => s.appMode);
  const setAppMode = useAppStore((s) => s.setAppMode);
  const showAuthGate = useAppStore((s) => s.showAuthGate);
  const setShowAuthGate = useAppStore((s) => s.setShowAuthGate);

  // Derive user/group IDs: use auth if logged in, otherwise demo defaults
  const currentUserId = auth.user?.id ?? DEMO_USER_ID;
  const currentUserGroupId = auth.user?.homeGroupId ?? DEMO_GROUP_ID;

  // Guest mode = not authenticated (demo or preview)
  const isGuest = !auth.isAuthenticated;

  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [draftIssueCoordinate, setDraftIssueCoordinate] = useState<Coordinate | null>(null);
  const [campusGateMessage, setCampusGateMessage] = useState<string | null>(null);
  const [territoryScores, setTerritoryScores] = useState(demoScenario.scores);
  const [territoryOwnership, setTerritoryOwnership] = useState(demoScenario.ownership);
  const [runSummary, setRunSummary] = useState<CompleteRunClaimResult | null>(null);
  const [showedInitialAuth, setShowedInitialAuth] = useState(false);
  const [simulatorActive, setSimulatorActive] = useState(false);

  const [interactionIntent, setInteractionIntent] = useState<'issue' | 'sighting'>('issue');
  const [draftSightingCoordinate, setDraftSightingCoordinate] = useState<Coordinate | null>(null);
  const [selectedSightingId, setSelectedSightingId] = useState<string | null>(null);

  const isCampusMode = appMode === 'campus';
  const simulatedUserLocation = isCampusMode ? onCampusLocation : previewLocation;
  const accessState = getCampusAccessState(simulatedUserLocation);
  const previewModeActive = !isCampusMode || accessState !== 'onCampus';
  const initialRegion = previewModeActive ? USF_PREVIEW_REGION : USF_INITIAL_REGION;
  const currentGroupName =
    demoScenario.groups.find((group) => group.id === currentUserGroupId)?.name ?? currentUserGroupId;

  // Show auth gate on first launch
  useEffect(() => {
    if (!showedInitialAuth && auth.authState !== 'loading') {
      setShowedInitialAuth(true);
      if (!auth.isAuthenticated) {
        setShowAuthGate(true);
      }
    }
  }, [auth.authState, auth.isAuthenticated, showedInitialAuth, setShowAuthGate]);

  // Auto-switch to campus mode if authenticated and on campus
  useEffect(() => {
    if (auth.isAuthenticated && accessState === 'onCampus') {
      setAppMode('campus');
    }
  }, [auth.isAuthenticated, accessState, setAppMode]);

  const { issues, reportIssue, markIssueFixed } = useIssueReports({
    initialIssues: demoScenario.issues,
    currentUserId,
    currentUserGroupId,
  });
  const { sightings, addSighting } = useSightings({
    initialSightings: demoScenario.sightings,
    currentUserId,
  });
  const runTracker = useRunTracker({
    userId: currentUserId,
    groupId: currentUserGroupId,
  });
  const { selectedColor, setSelectedColor, visibleCellArt, paintCell } = usePixelArt({
    userGroupId: currentUserGroupId,
    userId: currentUserId,
    ownership: territoryOwnership,
  });

  const selectedIssue = useMemo(
    () => issues.find((entry) => entry.id === selectedIssueId) ?? null,
    [issues, selectedIssueId],
  );

  const selectedSighting = useMemo(
    () => sightings.find((entry) => entry.id === selectedSightingId) ?? null,
    [sightings, selectedSightingId],
  );

  function showSelection(message: string) {
    setSelectedMessage(message);
  }

  function requireAuth(message: string): boolean {
    if (isGuest) {
      setCampusGateMessage(message);
      showSelection(message);
      setShowAuthGate(true);
      return true;
    }
    return false;
  }

  function requireCampusForAction(message: string): boolean {
    if (isGuest) {
      return requireAuth('Sign in to access this feature. Guests can view the map but cannot interact.');
    }
    if (previewModeActive) {
      setCampusGateMessage(message);
      showSelection(message);
      return true;
    }
    return false;
  }

  function handleCellPress(cellId: string) {
    showSelection(`Selected cell ${cellId}.`);
  }

  function handleIssuePress(issueId: string) {
    const issue = issues.find((entry) => entry.id === issueId);
    if (!issue) return;

    setDraftIssueCoordinate(null);
    setDraftSightingCoordinate(null);
    setSelectedSightingId(null);
    setSelectedIssueId(issueId);
    showSelection(`Issue selected: ${issue.title} (${issue.status}, ${issue.category}).`);
  }

  function handleMapLongPress(coordinate: Coordinate) {
    if (simulatorActive && runTracker.status === 'recording') {
      runTracker.addSimulatedPoint(coordinate);
      return;
    }

    if (
      requireCampusForAction(
        `Creating a ${interactionIntent} requires campus mode. Sign in to start.`,
      )
    ) {
      return;
    }

    if (interactionIntent === 'sighting') {
      setSelectedSightingId(null);
      setDraftSightingCoordinate(coordinate);
      showSelection(`Sighting draft opened.`);
    } else {
      setSelectedIssueId(null);
      setDraftIssueCoordinate(coordinate);
      showSelection(`Issue draft opened.`);
    }
  }

  function handleReportIssue(input: Parameters<typeof reportIssue>[0]) {
    const result = reportIssue(input);
    setDraftIssueCoordinate(null);
    setSelectedIssueId(result.issue.id);
    showSelection(
      `Reported "${result.issue.title}" for ${result.pointsAwarded} pts. Pin added in red.`,
    );
  }

  function handleAddSighting(input: Parameters<typeof addSighting>[0]) {
    const newSighting = addSighting(input);
    setDraftSightingCoordinate(null);
    setSelectedSightingId(newSighting.id);
    showSelection(`Sighting registered: "${newSighting.title}".`);
  }

  function handleFixIssue(issueId: string, afterPhotoUri?: string) {
    const result = markIssueFixed(issueId, afterPhotoUri);
    if (!result) return;

    setSelectedIssueId(result.issue.id);
    showSelection(
      `Fixed "${result.issue.title}" for ${result.pointsAwarded} pts. Pin turned green.`,
    );
    Alert.alert('Issue fixed', `${result.issue.title} fixed for ${result.pointsAwarded} pts.`);
  }

  function handleSightingPress(sightingId: string) {
    const sighting = sightings.find((entry) => entry.id === sightingId);
    if (!sighting) return;

    setSelectedIssueId(null);
    setDraftIssueCoordinate(null);
    setDraftSightingCoordinate(null);
    setSelectedSightingId(sighting.id);
    showSelection(`Sighting selected: ${sighting.title} (${sighting.category}).`);
  }

  function promptIssuePinning() {
    if (requireCampusForAction('Sign in to report an issue.')) return;
    setInteractionIntent('issue');
    showSelection('Long-press anywhere on the map to drop an issue pin.');
  }

  function promptSightingRegistration() {
    if (requireCampusForAction('Sign in to register a sighting.')) return;
    setInteractionIntent('sighting');
    showSelection('Long-press anywhere on the map to place a sighting pin.');
  }

  function toggleSimulatedMode() {
    if (isCampusMode) {
      setCampusGateMessage(null);
      setSelectedIssueId(null);
      setDraftIssueCoordinate(null);
      setRunSummary(null);
      setAppMode('preview');
      return;
    }

    const granted = auth.requestCampusMode();
    if (granted) {
      setCampusGateMessage(null);
      setSelectedIssueId(null);
      setDraftIssueCoordinate(null);
      setRunSummary(null);
    }
  }

  function toggleSimulatorMode() {
    setSimulatorActive((prev) => {
      const next = !prev;
      if (next) {
        showSelection('Simulator active. Tap "Simulate Run" and then click the map to draw your route.');
      } else {
        showSelection('Simulator disabled. Regular GPS tracking restored.');
      }
      return next;
    });
  }

  async function handleStartRun() {
    if (requireCampusForAction('Sign in and switch to campus mode to start a live run.')) {
      return;
    }

    setSelectedIssueId(null);
    setDraftIssueCoordinate(null);
    setRunSummary(null);

    if (simulatorActive) {
      const started = runTracker.startSimulatedRun();
      if (started) {
        if (runTracker.currentLocation) {
          runTracker.addSimulatedPoint(runTracker.currentLocation);
        }
        showSelection('Simulated run started. Tap the map to start plotting GPS points.');
      }
      return;
    }

    const started = await runTracker.startRun();
    if (started) {
      showSelection('Live run started. Move around campus to record GPS points.');
    }
  }

  async function handleResumeRun() {
    await runTracker.resumeRun();
    showSelection('Run resumed. GPS points are recording again.');
  }

  function handleFinishRun() {
    const completedRun = runTracker.finishRun();
    if (!completedRun) return;

    const result = completeRunClaim({
      runSession: completedRun,
      cells: demoScenario.cells,
      existingScores: territoryScores,
      userId: currentUserId,
      groupId: currentUserGroupId,
    });

    setRunSummary(result);

    if (result.claimCreated) {
      setTerritoryScores(result.updatedScores);
      setTerritoryOwnership(result.updatedOwnership);
      showSelection(
        `Valid loop. Claimed ${result.claimedCellCount} cells for ${currentGroupName} and earned ${result.pointsAwarded} pts.`,
      );
      return;
    }

    showSelection(`Run invalid. ${result.invalidReasons[0] ?? 'Loop rules were not met.'}`);
  }

  function handleCancelRun() {
    runTracker.cancelRun();
    showSelection('Live run canceled.');
  }

  function closePanel() {
    setSelectedIssueId(null);
    setDraftIssueCoordinate(null);
    setDraftSightingCoordinate(null);
    setSelectedSightingId(null);
    setRunSummary(null);
  }

  const hasActiveRunPanel =
    runTracker.status === 'recording' ||
    runTracker.status === 'paused' ||
    runTracker.status === 'permissionDenied' ||
    runTracker.status === 'error';

  const panelVisible =
    hasActiveRunPanel ||
    Boolean(draftIssueCoordinate) ||
    Boolean(draftSightingCoordinate) ||
    Boolean(selectedIssue) ||
    Boolean(selectedSighting) ||
    Boolean(runSummary);

  const visibleRunPaths =
    runTracker.livePathCoordinates.length > 1
      ? [...demoRunPaths, runTracker.livePathCoordinates]
      : demoRunPaths;

  const dockActions: ActionDockItem[] =
    runTracker.status === 'recording' || runTracker.status === 'paused'
      ? [
          {
            label: runTracker.status === 'recording' ? 'Pause Run' : 'Resume Run',
            onPress: runTracker.status === 'recording' ? runTracker.pauseRun : handleResumeRun,
            tone: runTracker.status === 'recording' ? 'secondary' : 'primary',
          },
          {
            label: 'Finish Run',
            onPress: handleFinishRun,
            tone: 'dark' as const,
          },
          {
            label: 'Cancel',
            onPress: handleCancelRun,
            tone: 'danger' as const,
          },
        ]
      : [
          {
            label:
              !simulatorActive && (runTracker.status === 'permissionDenied' || runTracker.status === 'error')
                ? 'Enable GPS'
                : simulatorActive
                  ? 'Simulate Run'
                  : 'Start Run',
            onPress: handleStartRun,
            tone: simulatorActive ? 'secondary' : 'primary',
          },
          { label: 'Report Issue', onPress: promptIssuePinning, tone: 'secondary' as const },
          {
            label: 'Register Sighting',
            onPress: promptSightingRegistration,
            tone: 'secondary' as const,
          },
        ];

  return (
    <AppShell>
      <SafeAreaView style={styles.screen} edges={['left', 'right']}>
        <View style={styles.mapWrap}>
          <CampusMap
            boardBoundary={USF_BOARD_BOUNDARY}
            userLocation={runTracker.currentLocation ?? simulatedUserLocation}
            runPath={visibleRunPaths}
            initialRegion={initialRegion}
            cells={demoScenario.cells}
            cellArt={visibleCellArt}
            ownership={territoryOwnership}
            issues={issues}
            sightings={sightings}
            groups={demoScenario.groups}
            simulatorActive={simulatorActive}
            onToggleSimulator={toggleSimulatorMode}
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
                  label={isCampusMode ? 'Preview' : 'Campus'}
                  onPress={toggleSimulatedMode}
                  tone={isCampusMode ? 'secondary' : 'dark'}
                  compact
                />
              </View>
              {previewModeActive ? <OffCampusBanner message={getOffCampusMessage(accessState)} /> : null}
              {isGuest ? (
                <OffCampusBanner
                  message="👋 Viewing as guest. Sign in to run, report, and claim territory."
                />
              ) : null}
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
                title={
                  hasActiveRunPanel
                    ? '🏃 Live Run'
                    : draftIssueCoordinate
                      ? '📋 Report Issue'
                      : selectedIssue
                        ? '📋 Issue Details'
                        : draftSightingCoordinate
                          ? '📸 Register Sighting'
                          : selectedSighting
                            ? '📍 Sighting Details'
                            : '🏁 Run Summary'
                }
                action={
                  hasActiveRunPanel ? undefined : (
                    <GlossyButton label="Close" onPress={closePanel} tone="secondary" compact />
                  )
                }>
                <ScrollView contentContainerStyle={styles.panelBody} showsVerticalScrollIndicator={false}>
                  {hasActiveRunPanel ? (
                    <ActiveRunOverlay
                      status={runTracker.status}
                      distanceMeters={runTracker.distanceMeters}
                      elapsedSeconds={runTracker.elapsedSeconds}
                      pointCount={runTracker.path.length}
                      errorMessage={runTracker.errorMessage}
                      onStartRun={() => {
                        void handleStartRun();
                      }}
                      onPauseRun={runTracker.pauseRun}
                      onResumeRun={() => {
                        void handleResumeRun();
                      }}
                      onFinishRun={handleFinishRun}
                      onCancelRun={handleCancelRun}
                    />
                  ) : draftIssueCoordinate ? (
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
                  ) : draftSightingCoordinate ? (
                    <SightingForm
                      coordinate={draftSightingCoordinate}
                      onSubmit={handleAddSighting}
                      onCancel={() => {
                        setDraftSightingCoordinate(null);
                        showSelection('Sighting draft canceled.');
                      }}
                    />
                  ) : selectedSighting ? (
                    selectedSighting.category === 'landmark' ? (
                      <LandmarkVoteCard sighting={selectedSighting} />
                    ) : (
                      <SightingCard sighting={selectedSighting} />
                    )
                  ) : runSummary ? (
                    <RunSummaryCard
                      runSession={runSummary.runSession}
                      loopResult={runSummary.loopResult}
                      invalidReasons={runSummary.invalidReasons}
                      claimedCellCount={runSummary.claimedCellCount}
                    />
                  ) : null}
                </ScrollView>
              </XPWindow>
            ) : null
          }
          dock={
            <ActionDock actions={dockActions} />
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

        {showAuthGate ? (
          <AuthGate
            onLogin={auth.signIn}
            onSignup={auth.signUp}
            onDemoMode={() => {
              auth.dismissAuthGate();
              setAppMode('demo');
            }}
            onDismiss={auth.dismissAuthGate}
            loading={auth.loading}
            error={auth.error}
          />
        ) : null}
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
  panelBody: {
    gap: RUNABLE_THEME.spacing.sm,
    paddingBottom: 4,
  },
});
