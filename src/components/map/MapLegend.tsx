import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { STATUS_COLORS } from '@/src/constants';
import { RunableCard } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { Group } from '@/src/types';

type MapLegendProps = {
  groups: Group[];
};

function LegendSwatch({ color }: { color: string }) {
  return <View style={[styles.swatch, { backgroundColor: color }]} />;
}

export function MapLegend({ groups }: MapLegendProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => setOpen((current) => !current)} style={styles.trigger}>
        <ThemedText type="defaultSemiBold">{open ? 'Hide Legend' : 'Legend'}</ThemedText>
      </Pressable>
      {open ? (
        <RunableCard>
          <View style={styles.container}>
            <ThemedText type="defaultSemiBold">Map Legend</ThemedText>
            {groups.slice(0, 2).map((group) => (
              <View key={group.id} style={styles.row}>
                <LegendSwatch color={group.primaryColor} />
                <ThemedText>{group.name} territory</ThemedText>
              </View>
            ))}
            <View style={styles.row}>
              <LegendSwatch color="rgba(15, 23, 42, 0.28)" />
              <ThemedText>Playable board</ThemedText>
            </View>
          </View>
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
        </RunableCard>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-start',
    gap: 8,
  },
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RUNABLE_THEME.radii.sm,
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
    ...RUNABLE_THEME.shadows.soft,
  },
  container: {
    gap: 8,
    maxWidth: 240,
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
