import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { VerificationBadge, VerificationWarning, GeminiVerdictModal } from '@/src/components/ai';
import { ISSUE_CATEGORIES, IssueCategoryPicker } from '@/src/components/issues/IssueCategoryPicker';
import { GlossyButton } from '@/src/components/ui';
import { verifyPhoto } from '@/src/lib/ai';
import { uploadImage } from '@/src/lib/supabase/storageService';
import type { Coordinate, IssueCategory, PhotoVerificationResult } from '@/src/types';

type IssueFormProps = {
  coordinate: Coordinate;
  onCancel?: () => void;
  onSubmit: (input: {
    title: string;
    category: IssueCategory;
    description?: string;
    coordinate: Coordinate;
    photoUri?: string;
    photoVerification?: PhotoVerificationResult;
  }) => void;
};

export function IssueForm({ coordinate, onCancel, onSubmit }: IssueFormProps) {
  const [title, setTitle] = useState('New campus issue');
  const [category, setCategory] = useState<IssueCategory>(ISSUE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [otherContext, setOtherContext] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [verification, setVerification] = useState<PhotoVerificationResult | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [verdictModalVisible, setVerdictModalVisible] = useState(false);

  async function openCamera() {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

  async function openGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

  function presentImagePicker() {
    Alert.alert('Attach Photo', 'Choose a photo source', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  async function handleSubmit() {
    if (!photoUri) {
      Alert.alert('Missing Photo', 'An image is required to submit an issue report.');
      return;
    }
    const isOther = category.toLowerCase() === 'other';
    if (isOther && !otherContext.trim()) {
      Alert.alert('Missing Context', 'Please define the custom category you selected.');
      return;
    }

    setIsUploading(true);
    let finalPhotoUri = photoUri;

    if (photoUri && !photoUri.startsWith('demo://')) {
      const uploaded = await uploadImage(photoUri, 'issue-images', `issue_${Date.now()}.jpg`);
      if (uploaded) finalPhotoUri = uploaded;
    }

    const photoVerification = finalPhotoUri
      ? await verifyPhoto({
        imageUri: finalPhotoUri,
        selectedCategory: category,
        context: 'issue',
        title,
        description,
        otherContext: isOther ? otherContext : undefined,
      })
      : undefined;

    setVerification(photoVerification);

    if (photoVerification && !photoVerification.isValid) {
      setVerdictModalVisible(true);
      setIsUploading(false);
      return;
    }

    onSubmit({
      title,
      category,
      description,
      coordinate,
      photoUri: finalPhotoUri || 'demo://issue-before-form',
      photoVerification,
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
      {category.toLowerCase() === 'other' ? (
        <TextInput
          value={otherContext}
          onChangeText={setOtherContext}
          placeholder="Specify what this 'Other' issue is..."
          style={styles.input}
        />
      ) : null}
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Optional description"
        multiline
        style={[styles.input, styles.multiline]}
      />
      <Pressable style={styles.photoContainer} onPress={presentImagePicker} disabled={isUploading}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photoImage} contentFit="contain" />
        ) : (
          <View style={styles.photoPlaceholder}>
            <ThemedText style={{ color: '#64748B' }}>📷 Tap to attach photo</ThemedText>
          </View>
        )}
      </Pressable>
      <VerificationBadge verification={verification} />
      <VerificationWarning verification={verification} />

      <ThemedText style={styles.coordText}>
        Report coordinate: {coordinate[0].toFixed(4)}, {coordinate[1].toFixed(4)}
      </ThemedText>
      <View style={styles.actionRow}>
        {onCancel ? <GlossyButton label="Cancel" onPress={onCancel} tone="secondary" disabled={isUploading} /> : null}
        <GlossyButton label={isUploading ? 'Uploading...' : 'Report issue'} onPress={handleSubmit} tone="danger" disabled={isUploading} />
      </View>

      <GeminiVerdictModal
        visible={verdictModalVisible}
        onClose={() => setVerdictModalVisible(false)}
        result={verification || null}
      />
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
