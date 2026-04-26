import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PixelChip } from '@/src/components/ui';
import { SIGHTING_CATEGORIES } from '@/src/components/sightings/SightingCategoryPicker';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { Sighting } from '@/src/types';

type SightingCardProps = {
  sighting: Sighting;
};

export function SightingCard({ sighting }: SightingCardProps) {
  const categoryMeta = SIGHTING_CATEGORIES.find((c) => c.id === sighting.category);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          {categoryMeta?.icon} {sighting.title}
        </ThemedText>
        <PixelChip label={categoryMeta?.label ?? sighting.category} tone="blue" />
      </View>

      <ThemedText style={styles.meta}>
        Reported on {new Date(sighting.createdAt).toLocaleString()}
      </ThemedText>

      {sighting.description && (
        <View style={styles.bodyWrap}>
          <ThemedText>{sighting.description}</ThemedText>
        </View>
      )}

      {/* Mock photo block if one hypothetically existed or they attached one */}
      <View style={styles.photoMock}>
        <ThemedText style={{ color: '#94A3B8' }}>[ Attached Photo ]</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: RUNABLE_THEME.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: RUNABLE_THEME.spacing.sm,
  },
  title: {
    flex: 1,
    color: RUNABLE_THEME.colors.ink,
  },
  meta: {
    fontSize: RUNABLE_THEME.fontSizes.sm,
    color: RUNABLE_THEME.colors.ink,
    opacity: 0.8,
  },
  bodyWrap: {
    padding: RUNABLE_THEME.spacing.sm,
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 1,
    borderColor: RUNABLE_THEME.colors.border,
  },
  photoMock: {
    height: 120,
    backgroundColor: '#F1F5F9',
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
