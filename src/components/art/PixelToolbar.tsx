import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PixelColorPicker } from '@/src/components/art/PixelColorPicker';

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
      <ThemedText type="defaultSemiBold">Pixel Paint</ThemedText>
      <ThemedText>{currentGroupName} can paint owned cells only.</ThemedText>
      <PixelColorPicker
        colors={colors}
        selectedColor={selectedColor}
        onSelectColor={onSelectColor}
      />
      <ThemedText>Painted cells visible: {paintedCount}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
});
