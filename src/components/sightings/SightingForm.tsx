import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { SIGHTING_CATEGORIES, SightingCategoryPicker } from '@/src/components/sightings/SightingCategoryPicker';
import { GlossyButton } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { Coordinate, SightingCategory } from '@/src/types';
import { ThemedText } from '@/components/themed-text';

type SightingFormProps = {
  coordinate: Coordinate;
  onSubmit: (input: {
    title: string;
    description: string;
    category: SightingCategory;
    coordinate: Coordinate;
  }) => void;
  onCancel: () => void;
};

export function SightingForm({ coordinate, onSubmit, onCancel }: SightingFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SightingCategory>('animal');

  const isValid = title.trim().length > 0;

  function handleSubmit() {
    if (isValid) {
      onSubmit({ title, description, category, coordinate });
    }
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.hint}>
        Adding a new sighting at {coordinate[0].toFixed(4)}, {coordinate[1].toFixed(4)}
      </ThemedText>

      <TextLabel>Category</TextLabel>
      <SightingCategoryPicker selectedCategory={category} onSelectCategory={setCategory} />

      <TextLabel>Title</TextLabel>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="E.g., Turtle near the library"
        placeholderTextColor={RUNABLE_THEME.colors.ink}
      />

      <TextLabel>Description (Optional)</TextLabel>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Add details..."
        placeholderTextColor={RUNABLE_THEME.colors.ink}
        multiline
        numberOfLines={3}
      />

      {/* Mock photo picker */}
      <View style={styles.photoMock}>
        <ThemedText style={styles.photoHint}>📷 Tap to attach photo (Demo)</ThemedText>
      </View>

      <View style={styles.actionRow}>
        <GlossyButton label="Cancel" onPress={onCancel} tone="secondary" />
        <GlossyButton label="Add Sighting" onPress={handleSubmit} tone={isValid ? 'primary' : 'secondary'} />
      </View>
    </View>
  );
}

function TextLabel({ children }: { children: React.ReactNode }) {
  return (
    <ThemedText type="defaultSemiBold" style={{ color: RUNABLE_THEME.colors.ink, fontSize: 14 }}>
      {children}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: RUNABLE_THEME.spacing.sm,
  },
  hint: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: RUNABLE_THEME.spacing.xs,
  },
  input: {
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderWidth: 2,
    borderColor: '#94A3B8',
    borderRadius: RUNABLE_THEME.radii.sm,
    padding: RUNABLE_THEME.spacing.md,
    color: RUNABLE_THEME.colors.ink,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  photoMock: {
    height: 80,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: RUNABLE_THEME.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: RUNABLE_THEME.spacing.xs,
  },
  photoHint: {
    fontSize: 14,
    color: '#64748B',
  },
  actionRow: {
    flexDirection: 'row',
    gap: RUNABLE_THEME.spacing.sm,
    justifyContent: 'flex-end',
    marginTop: RUNABLE_THEME.spacing.md,
  },
});
