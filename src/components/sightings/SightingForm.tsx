import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

import { SightingCategoryPicker } from '@/src/components/sightings/SightingCategoryPicker';
import { uploadImage } from '@/src/lib/supabase/storageService';
import { GlossyButton } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { verifyPhoto } from '@/src/lib/ai';
import { VerificationBadge, VerificationWarning } from '@/src/components/ai';
import type { Coordinate, PhotoVerificationResult, SightingCategory } from '@/src/types';
import { ThemedText } from '@/components/themed-text';

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
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [verification, setVerification] = useState<PhotoVerificationResult | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);

  const isValid = title.trim().length > 0;

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
    if (!isValid) return;

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
        })
      : undefined;

    onSubmit({
      title,
      description,
      category,
      coordinate,
      photoUri: finalPhotoUri ?? undefined,
      photoVerification,
    });
    setVerification(photoVerification);
    setIsUploading(false);
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

      <TextLabel>Photo</TextLabel>
      <Pressable style={styles.photoContainer} onPress={pickImage} disabled={isUploading}>
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
