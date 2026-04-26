import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PixelColorPicker } from '@/src/components/art/PixelColorPicker';
import { PixelChip } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';

type PixelToolbarProps = {
  colors: string[];
  selectedColor: string;
  paintedCount: number;
  currentGroupName: string;
  onSelectColor: (color: string) => void;
};

export function PixelToolbar({
  colors,
  selectedColor,
  paintedCount,
  currentGroupName,
  onSelectColor,
}: PixelToolbarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">Pixel Paint</ThemedText>
        <PixelChip label={`${paintedCount} painted`} tone="blue" />
      </View>
      <ThemedText>{currentGroupName} can paint owned cells only.</ThemedText>
      <PixelColorPicker
        colors={colors}
        selectedColor={selectedColor}
        onSelectColor={onSelectColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: RUNABLE_THEME.spacing.sm,
  },
});
