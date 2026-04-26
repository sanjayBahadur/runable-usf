import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { DEVELOPMENT_LOG } from '@/src/constants';

export default function DevelopmentLogScreen() {
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
          Development Log
        </ThemedText>
        <ThemedText>
          Checklist history for Modules 00 through 06 now lives here instead of the main map tab.
        </ThemedText>
      </ThemedView>
      {DEVELOPMENT_LOG.map((entry) => (
        <ThemedView key={entry.module} style={styles.card}>
          <ThemedText type="subtitle">
            {entry.module} - {entry.title}
          </ThemedText>
          {entry.checklist.map((item) => (
            <ThemedText key={item} style={styles.checklistItem}>
              [x] {item}
            </ThemedText>
          ))}
        </ThemedView>
      ))}
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
  checklistItem: {
    lineHeight: 22,
  },
});
