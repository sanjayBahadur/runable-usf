import { Pressable, StyleSheet, View } from 'react-native';

type PixelColorPickerProps = {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
};

export function PixelColorPicker({
  colors,
  selectedColor,
  onSelectColor,
}: PixelColorPickerProps) {
  return (
    <View style={styles.row}>
      {colors.map((color) => (
        <Pressable
          key={color}
          onPress={() => onSelectColor(color)}
          style={[
            styles.swatch,
            { backgroundColor: color },
            selectedColor === color ? styles.activeSwatch : undefined,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(15, 23, 42, 0.14)',
  },
  activeSwatch: {
    borderColor: '#0F172A',
    transform: [{ scale: 1.08 }],
  },
});
