import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { SightingCategory } from '@/src/types';

export const SIGHTING_CATEGORIES: { id: SightingCategory; label: string; icon: string }[] = [
  { id: 'animal', label: 'Animal', icon: '🐿️' },
  { id: 'plant', label: 'Plant/Tree', icon: '🌳' },
  { id: 'scenic', label: 'Scenic Spot', icon: '📸' },
  { id: 'water', label: 'Pond/Lake', icon: '🦆' },
  { id: 'landmark', label: 'Landmark', icon: '🏛️' },
  { id: 'other', label: 'Other', icon: '📍' },
];

type SightingCategoryPickerProps = {
  selectedCategory: SightingCategory;
  onSelectCategory: (category: SightingCategory) => void;
};

export function SightingCategoryPicker({
  selectedCategory,
  onSelectCategory,
}: SightingCategoryPickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {SIGHTING_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;

        return (
          <Pressable
            key={cat.id}
            style={[styles.chip, isSelected ? styles.chipSelected : null]}
            onPress={() => onSelectCategory(cat.id)}>
            <ThemedText style={styles.icon}>{cat.icon}</ThemedText>
            <ThemedText style={[styles.label, isSelected ? styles.labelSelected : null]}>
              {cat.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: RUNABLE_THEME.spacing.sm,
    paddingVertical: RUNABLE_THEME.spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RUNABLE_THEME.radii.chip,
    backgroundColor: RUNABLE_THEME.colors.windowGray,
    borderWidth: 1,
    borderColor: RUNABLE_THEME.colors.border,
  },
  chipSelected: {
    backgroundColor: RUNABLE_THEME.colors.xpBlue,
    borderColor: '#1E3A8A',
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    color: '#334155',
  },
  labelSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
