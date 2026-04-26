import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CAMPUS_CONFIG, GRID_RULES, LOOP_RULES, POINTS } from '@/src/constants';
import {
  detectClosedLoop,
  generateCampusGrid,
} from '@/src/lib/geometry';
import {
  applyClaimToCells,
  createClaimFromRun,
  getActiveGamePeriod,
  resolveCellOwnership,
} from '@/src/lib/territory';
import type { Coordinate, RunSession } from '@/src/types';

const moduleChecklist = [
  'Pure TypeScript territory helpers exported from src/lib/territory/index.ts',
  'Claim score now combines base points, distance, area, and capped pace bonus',
  'Valid run sessions can be converted into scored territory claims',
  'Claims apply only to cells whose centers fall inside the claim polygon',
  'Ownership resolves by highest score while keeping runner-up overlap data',
  'Expo Go screen renders a visible Module 02 overlap checklist and demo',
];

const bullsLoop: Coordinate[] = [
  [28.0673, -82.4243],
  [28.0681, -82.4251],
  [28.0692, -82.4251],
  [28.07, -82.4242],
  [28.0701, -82.4229],
  [28.0693, -82.4219],
  [28.0681, -82.4218],
  [28.0672, -82.4228],
  [28.0673, -82.4243],
];

const herdLoop: Coordinate[] = [
  [28.068, -82.4244],
  [28.0688, -82.425],
  [28.0697, -82.4246],
  [28.0703, -82.4236],
  [28.0701, -82.4224],
  [28.0692, -82.4218],
  [28.0681, -82.422],
  [28.0676, -82.423],
  [28.068, -82.4244],
];

const campusGrid = generateCampusGrid(CAMPUS_CONFIG.boundary, GRID_RULES.cellSizeMeters);
const activePeriod = getActiveGamePeriod(new Date('2026-04-25T13:30:00.000Z'));

const bullsRun: RunSession = {
  id: 'run-bulls',
  userId: 'user-bulls',
  groupId: 'bulls',
  path: bullsLoop.map((coordinate, index) => ({
    coordinate,
    recordedAt: new Date(Date.UTC(2026, 3, 25, 13, index)).toISOString(),
  })),
  startedAt: '2026-04-25T13:00:00.000Z',
  endedAt: '2026-04-25T13:18:00.000Z',
  distanceMeters: 0,
  status: 'completed',
};

const herdRun: RunSession = {
  id: 'run-herd',
  userId: 'user-herd',
  groupId: 'herd',
  path: herdLoop.map((coordinate, index) => ({
    coordinate,
    recordedAt: new Date(Date.UTC(2026, 3, 25, 13, 30 + index)).toISOString(),
  })),
  startedAt: '2026-04-25T13:30:00.000Z',
  endedAt: '2026-04-25T13:42:00.000Z',
  distanceMeters: 0,
  status: 'completed',
};

const bullsLoopResult = detectClosedLoop(bullsRun.path, LOOP_RULES);
const herdLoopResult = detectClosedLoop(herdRun.path, LOOP_RULES);

const bullsClaim = createClaimFromRun(bullsRun, bullsLoopResult, bullsRun.userId, bullsRun.groupId);
const herdClaim = createClaimFromRun(herdRun, herdLoopResult, herdRun.userId, herdRun.groupId);

const cellScoresAfterBulls = bullsClaim ? applyClaimToCells(bullsClaim, campusGrid, []) : [];
const cellScoresAfterHerd =
  bullsClaim && herdClaim
    ? applyClaimToCells(herdClaim, campusGrid, cellScoresAfterBulls)
    : cellScoresAfterBulls;

const resolvedOwnership = resolveCellOwnership(cellScoresAfterHerd);
const contestedCellIds = new Set(
  cellScoresAfterHerd
    .filter((cellScore) =>
      cellScoresAfterHerd.some(
        (otherScore) =>
          otherScore.cellId === cellScore.cellId && otherScore.groupId !== cellScore.groupId,
      ),
    )
    .map((cellScore) => cellScore.cellId),
);
const bullsOwnedCount = resolvedOwnership.filter((cell) => cell.groupId === 'bulls').length;
const herdOwnedCount = resolvedOwnership.filter((cell) => cell.groupId === 'herd').length;
const herdStolenCount = resolvedOwnership.filter(
  (cell) => cell.groupId === 'herd' && cell.runnerUpGroupId === 'bulls',
).length;
const bullsUnaffectedCount = resolvedOwnership.filter(
  (cell) => cell.groupId === 'bulls' && !contestedCellIds.has(cell.cellId),
).length;
const sampleOverlap = resolvedOwnership.find((cell) => cell.runnerUpGroupId);

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D7F5E8', dark: '#123728' }}
      headerImage={<View style={styles.heroPanel} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Module 02</ThemedText>
        <ThemedText type="subtitle">Territory Engine</ThemedText>
      </ThemedView>
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold">Visible completion status</ThemedText>
        <ThemedText>
          Module 02 is now wired into the app with claim scoring, overlap resolution, and a
          territory checklist rendered in Expo Go.
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
        <ThemedText type="subtitle">Live territory snapshot</ThemedText>
        <ThemedText>Campus: {CAMPUS_CONFIG.shortName}</ThemedText>
        <ThemedText>Grid cell size: {GRID_RULES.cellSizeMeters}m</ThemedText>
        <ThemedText>Generated campus cells: {campusGrid.length}</ThemedText>
        <ThemedText>Active period: {activePeriod.name}</ThemedText>
        <ThemedText>Bulls loop valid: {bullsLoopResult.passesRules ? 'yes' : 'no'}</ThemedText>
        <ThemedText>Herd loop valid: {herdLoopResult.passesRules ? 'yes' : 'no'}</ThemedText>
        <ThemedText>Bulls claim score: {bullsClaim?.score.toFixed(1) ?? 'n/a'}</ThemedText>
        <ThemedText>Herd claim score: {herdClaim?.score.toFixed(1) ?? 'n/a'}</ThemedText>
        <ThemedText>Scored cell entries: {cellScoresAfterHerd.length}</ThemedText>
        <ThemedText>Contested cells: {contestedCellIds.size}</ThemedText>
        <ThemedText>Bulls owned cells: {bullsOwnedCount}</ThemedText>
        <ThemedText>Herd owned cells: {herdOwnedCount}</ThemedText>
        <ThemedText>Herd stolen cells: {herdStolenCount}</ThemedText>
        <ThemedText>Bulls non-overlapped cells kept: {bullsUnaffectedCount}</ThemedText>
        <ThemedText>Territory stolen reward: {POINTS.territoryStolen} pts</ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Overlap result</ThemedText>
        <ThemedText>
          Overlaps resolve cell by cell. The higher score takes the contested cell for the active
          period, while untouched cells stay with the earlier claim owner.
        </ThemedText>
        {sampleOverlap ? (
          <ThemedText>
            Sample contested cell: {sampleOverlap.cellId} owned by {sampleOverlap.groupId} over{' '}
            {sampleOverlap.runnerUpGroupId} at {sampleOverlap.score.toFixed(1)} vs{' '}
            {sampleOverlap.runnerUpScore?.toFixed(1) ?? '0.0'}.
          </ThemedText>
        ) : null}
        <ThemedText>
          Inspect `src/lib/territory/index.ts` for the module surface and `applyClaimToCells` plus
          `resolveCellOwnership` for the overlap flow.
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
