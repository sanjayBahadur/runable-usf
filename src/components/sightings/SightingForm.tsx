import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { VerificationBadge, VerificationWarning, GeminiVerdictModal } from '@/src/components/ai';
import { SightingCategoryPicker } from '@/src/components/sightings/SightingCategoryPicker';
import { GlossyButton } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { verifyPhoto } from '@/src/lib/ai';
import { uploadImage } from '@/src/lib/supabase/storageService';
import type { Coordinate, PhotoVerificationResult, SightingCategory } from '@/src/types';

type SightingFormProps = {
  coordinate: Coordinate;
  onSubmit: (input: {
    title: string;
    description: string;
    category: SightingCategory;
    coordinate: Coordinate;
    photoUri?: string;
    photoVerification?: PhotoVerificationResult;
  }) => void;
  onCancel: () => void;
};

export function SightingForm({ coordinate, onSubmit, onCancel }: SightingFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SightingCategory>('animal');
  const [otherContext, setOtherContext] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [verification, setVerification] = useState<PhotoVerificationResult | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [verdictModalVisible, setVerdictModalVisible] = useState(false);

  const isValid = title.trim().length > 0;

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
    if (!isValid) return;

    if (!photoUri) {
      Alert.alert('Missing Photo', 'An image is required to submit a sighting report.');
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
      const uploaded = await uploadImage(photoUri, 'sighting-images', `sighting_${Date.now()}.jpg`);
      if (uploaded) finalPhotoUri = uploaded;
    }

    const photoVerification = finalPhotoUri
      ? await verifyPhoto({
        imageUri: finalPhotoUri,
        selectedCategory: category,
        context: category === 'landmark' ? 'landmark' : 'sighting',
        title: title,
        description: description,
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
      description,
      category,
      coordinate,
      photoUri: finalPhotoUri ?? undefined,
      photoVerification,
    });
    setIsUploading(false);
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.hint}>
        Adding a new sighting at {coordinate[0].toFixed(4)}, {coordinate[1].toFixed(4)}
      </ThemedText>

      <TextLabel>Category</TextLabel>
      <SightingCategoryPicker selectedCategory={category} onSelectCategory={setCategory} />

      {category.toLowerCase() === 'other' ? (
        <>
          <TextLabel>Specific Category</TextLabel>
          <TextInput
            style={styles.input}
            value={otherContext}
            onChangeText={setOtherContext}
            placeholder="Specify what 'Other' is..."
            placeholderTextColor={RUNABLE_THEME.colors.ink}
          />
        </>
      ) : null}

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

      <TextLabel>Photo</TextLabel>
      <Pressable style={styles.photoContainer} onPress={presentImagePicker} disabled={isUploading}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photoImage} contentFit="contain" />
        ) : (
          <View style={styles.photoPlaceholder}>
            <ThemedText style={styles.photoHint}>📷 Tap to attach photo</ThemedText>
          </View>
        )}
      </Pressable>
      <VerificationBadge verification={verification} />
      <VerificationWarning verification={verification} />

      <View style={styles.actionRow}>
        <GlossyButton label="Cancel" onPress={onCancel} tone="secondary" disabled={isUploading} />
        <GlossyButton label={isUploading ? 'Uploading...' : 'Add Sighting'} onPress={handleSubmit} tone={isValid ? 'primary' : 'secondary'} disabled={isUploading} />
      </View>

      <GeminiVerdictModal
        visible={verdictModalVisible}
        onClose={() => setVerdictModalVisible(false)}
        result={verification || null}
      />
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
  photoContainer: {
    height: 120,
    width: '100%',
    borderRadius: RUNABLE_THEME.radii.sm,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginTop: RUNABLE_THEME.spacing.xs,
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
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: RUNABLE_THEME.radii.sm,
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
