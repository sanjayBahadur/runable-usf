import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CAMPUS_CONFIG, GRID_RULES, LOOP_RULES, POINTS } from '@/src/constants';

const moduleChecklist = [
  'Shared types created under src/types',
  'Shared constants created under src/constants',
  'Barrel exports available for imports',
  'Approximate USF campus boundary added',
  'Loop, grid, and points rules defined',
  'Expo Go screen updated to show Module 00 status',
];

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D7F5E8', dark: '#123728' }}
      headerImage={<View style={styles.heroPanel} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Module 00</ThemedText>
        <ThemedText type="subtitle">Shared Types and Constants</ThemedText>
      </ThemedView>
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold">Visible completion status</ThemedText>
        <ThemedText>
          Module 00 is now wired into the app with the shared type surface, shared constants, and
          a checklist rendered in Expo Go.
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
        <ThemedText type="subtitle">Game rules snapshot</ThemedText>
        <ThemedText>Campus: {CAMPUS_CONFIG.shortName}</ThemedText>
        <ThemedText>Boundary points: {CAMPUS_CONFIG.boundary.length}</ThemedText>
        <ThemedText>Grid cell size: {GRID_RULES.cellSizeMeters}m</ThemedText>
        <ThemedText>Minimum loop distance: {LOOP_RULES.minPathDistanceMeters}m</ThemedText>
        <ThemedText>Minimum loop area: {LOOP_RULES.minAreaSquareMeters}m^2</ThemedText>
        <ThemedText>Valid loop bonus: {POINTS.validLoopBonus} pts</ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Where to inspect</ThemedText>
        <ThemedText>
          `src/types/index.ts` and `src/constants/index.ts` now provide the shared import surface
          for the next modules.
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
