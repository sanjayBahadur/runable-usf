import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CAMPUS_CONFIG, GRID_RULES, LOOP_RULES, POINTS } from '@/src/constants';
import {
  calculateDistanceMeters,
  calculatePathDistanceMeters,
  calculatePolygonAreaSquareMeters,
  detectClosedLoop,
  generateCampusGrid,
  getCellsInsidePolygon,
  isPathInsideCampus,
  isPointInsidePolygon,
} from '@/src/lib/geometry';
import type { Coordinate } from '@/src/types';

const moduleChecklist = [
  'Pure TypeScript geometry helpers exported from src/lib/geometry/index.ts',
  'Haversine distance and full path distance calculations added',
  'Closed-loop detection validates distance, closure, point count, and area',
  'Campus grid cells now include center coordinates and polygon corners',
  'Cell selection filters grid cells by polygon containment',
  'Expo Go screen renders live Module 01 geometry status',
];

const demoLoop: Coordinate[] = [
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

const campusGrid = generateCampusGrid(CAMPUS_CONFIG.boundary, GRID_RULES.cellSizeMeters);
const loopResult = detectClosedLoop(demoLoop, LOOP_RULES);
const selectedCells = getCellsInsidePolygon(campusGrid, demoLoop);
const isDemoLoopInsideCampus = isPathInsideCampus(demoLoop, CAMPUS_CONFIG.boundary);
const demoLoopDistanceMeters = calculatePathDistanceMeters(demoLoop);
const demoLoopAreaSquareMeters = calculatePolygonAreaSquareMeters(demoLoop);
const demoSpanMeters = calculateDistanceMeters(demoLoop[0], demoLoop[4]);
const demoCenterInsideCampus = isPointInsidePolygon(CAMPUS_CONFIG.center, CAMPUS_CONFIG.boundary);

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D7F5E8', dark: '#123728' }}
      headerImage={<View style={styles.heroPanel} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Module 01</ThemedText>
        <ThemedText type="subtitle">Geometry Engine</ThemedText>
      </ThemedView>
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold">Visible completion status</ThemedText>
        <ThemedText>
          Module 01 is now wired into the app with live geometry calculations, generated campus
          cells, and a checklist rendered in Expo Go.
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
        <ThemedText type="subtitle">Live geometry snapshot</ThemedText>
        <ThemedText>Campus: {CAMPUS_CONFIG.shortName}</ThemedText>
        <ThemedText>Boundary points: {CAMPUS_CONFIG.boundary.length}</ThemedText>
        <ThemedText>Grid cell size: {GRID_RULES.cellSizeMeters}m</ThemedText>
        <ThemedText>Generated campus cells: {campusGrid.length}</ThemedText>
        <ThemedText>Cells inside demo loop: {selectedCells.length}</ThemedText>
        <ThemedText>Demo loop points: {demoLoop.length}</ThemedText>
        <ThemedText>Demo path distance: {demoLoopDistanceMeters.toFixed(1)}m</ThemedText>
        <ThemedText>Demo polygon area: {demoLoopAreaSquareMeters.toFixed(1)}m^2</ThemedText>
        <ThemedText>Start-to-midpoint span: {demoSpanMeters.toFixed(1)}m</ThemedText>
        <ThemedText>Closing distance: {loopResult.closingDistanceMeters.toFixed(1)}m</ThemedText>
        <ThemedText>Path inside campus: {isDemoLoopInsideCampus ? 'yes' : 'no'}</ThemedText>
        <ThemedText>Campus center inside boundary: {demoCenterInsideCampus ? 'yes' : 'no'}</ThemedText>
        <ThemedText>Loop passes rules: {loopResult.passesRules ? 'yes' : 'no'}</ThemedText>
        <ThemedText>Valid loop bonus: {POINTS.validLoopBonus} pts</ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Where to inspect</ThemedText>
        <ThemedText>
          `src/lib/geometry/index.ts` now provides the import surface for the geometry engine, and
          the home tab uses those functions directly for the visible demo.
        </ThemedText>
        <ThemedText>
          Valid loop result: {loopResult.passesRules ? 'accepted' : 'rejected'} with{' '}
          {loopResult.enclosedAreaSquareMeters.toFixed(1)}m^2 enclosed.
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
