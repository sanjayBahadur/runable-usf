import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { STATUS_COLORS } from '@/src/constants';
import type { Group } from '@/src/types';

type MapLegendProps = {
  groups: Group[];
};

function LegendSwatch({ color }: { color: string }) {
  return <View style={[styles.swatch, { backgroundColor: color }]} />;
}

export function MapLegend({ groups }: MapLegendProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold">Map Legend</ThemedText>
      {groups.slice(0, 2).map((group) => (
        <View key={group.id} style={styles.row}>
          <LegendSwatch color={group.primaryColor} />
          <ThemedText>{group.name} territory</ThemedText>
        </View>
      ))}
      <View style={styles.row}>
        <LegendSwatch color={STATUS_COLORS.route} />
        <ThemedText>Demo run path</ThemedText>
      </View>
      <View style={styles.row}>
        <LegendSwatch color={STATUS_COLORS.issueOpen} />
        <ThemedText>Open issue</ThemedText>
      </View>
      <View style={styles.row}>
        <LegendSwatch color={STATUS_COLORS.issueFixed} />
        <ThemedText>Fixed issue</ThemedText>
      </View>
      <View style={styles.row}>
        <LegendSwatch color={STATUS_COLORS.sighting} />
        <ThemedText>Sighting</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
