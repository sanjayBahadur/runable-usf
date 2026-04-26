import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { uploadImage } from '@/src/lib/supabase/storageService';
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
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function handleSubmit() {
    setIsUploading(true);
    let finalPhotoUri = photoUri;

    if (photoUri && !photoUri.startsWith('demo://')) {
      const uploaded = await uploadImage(photoUri, 'issue-images', `issue_${Date.now()}.jpg`);
      if (uploaded) finalPhotoUri = uploaded;
    }

    onSubmit({
      title,
      category,
      description,
      coordinate,
      photoUri: finalPhotoUri || 'demo://issue-before-form',
    });
    setTitle('New campus issue');
    setCategory(ISSUE_CATEGORIES[0]);
    setDescription('');
    setPhotoUri(null);
    setIsUploading(false);
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
      <Pressable style={styles.photoContainer} onPress={pickImage} disabled={isUploading}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photoImage} contentFit="contain" />
        ) : (
          <View style={styles.photoPlaceholder}>
            <ThemedText style={{ color: '#64748B' }}>📷 Tap to attach photo</ThemedText>
          </View>
        )}
      </Pressable>

      <ThemedText style={styles.coordText}>
        Report coordinate: {coordinate[0].toFixed(4)}, {coordinate[1].toFixed(4)}
      </ThemedText>
      <View style={styles.actionRow}>
        {onCancel ? <GlossyButton label="Cancel" onPress={onCancel} tone="secondary" disabled={isUploading} /> : null}
        <GlossyButton label={isUploading ? 'Uploading...' : 'Report issue'} onPress={handleSubmit} tone="danger" disabled={isUploading} />
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
  photoContainer: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  photoImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 12,
  },
  coordText: {
    fontSize: 12,
    color: '#64748B',
  },
});
