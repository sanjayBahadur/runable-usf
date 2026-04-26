import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { IssueCategory } from '@/src/types';

export const ISSUE_CATEGORIES: IssueCategory[] = [
  'Litter',
  'Broken Infrastructure',
  'Pavement Damage',
  'Other',
];

type IssueCategoryPickerProps = {
  selectedCategory: IssueCategory;
  onSelectCategory: (category: IssueCategory) => void;
};

export function IssueCategoryPicker({
  selectedCategory,
  onSelectCategory,
}: IssueCategoryPickerProps) {
  return (
    <View style={styles.container}>
      {ISSUE_CATEGORIES.map((category) => (
        <Pressable
          key={category}
          onPress={() => onSelectCategory(category)}
          style={[
            styles.pill,
            selectedCategory === category ? styles.activePill : undefined,
          ]}>
          <ThemedText>{category}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
  },
  activePill: {
    backgroundColor: 'rgba(220, 38, 38, 0.18)',
  },
});
