import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ISSUE_CATEGORIES, IssueCategoryPicker } from '@/src/components/issues/IssueCategoryPicker';
import { GlossyButton } from '@/src/components/ui';
import type { Coordinate, IssueCategory } from '@/src/types';

type IssueFormProps = {
  coordinate: Coordinate;
  onCancel?: () => void;
  onSubmit: (input: {
    title: string;
    category: IssueCategory;
    description?: string;
    coordinate: Coordinate;
    photoUri?: string;
  }) => void;
};

export function IssueForm({ coordinate, onCancel, onSubmit }: IssueFormProps) {
  const [title, setTitle] = useState('New campus issue');
  const [category, setCategory] = useState<IssueCategory>(ISSUE_CATEGORIES[0]);
  const [description, setDescription] = useState('');

  function handleSubmit() {
    onSubmit({
      title,
      category,
      description,
      coordinate,
      photoUri: 'demo://issue-before-form',
    });
    setTitle('New campus issue');
    setCategory(ISSUE_CATEGORIES[0]);
    setDescription('');
  }

  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold">Report Issue</ThemedText>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Issue title"
        style={styles.input}
      />
      <IssueCategoryPicker selectedCategory={category} onSelectCategory={setCategory} />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Optional description"
        multiline
        style={[styles.input, styles.multiline]}
      />
      <ThemedText>
        Report coordinate: {coordinate[0].toFixed(4)}, {coordinate[1].toFixed(4)}
      </ThemedText>
      <View style={styles.actionRow}>
        {onCancel ? <GlossyButton label="Cancel" onPress={onCancel} tone="secondary" /> : null}
        <GlossyButton label="Report issue" onPress={handleSubmit} tone="danger" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  multiline: {
    minHeight: 74,
    textAlignVertical: 'top',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
});
