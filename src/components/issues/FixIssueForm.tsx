import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GeminiVerdictModal, VerificationBadge, VerificationWarning } from '@/src/components/ai';
import { GlossyButton } from '@/src/components/ui';
import { verifyIssueFixBeforeAfter } from '@/src/lib/ai';
import { uploadImage } from '@/src/lib/supabase/storageService';
import type { IssueReport, PhotoVerificationResult } from '@/src/types';

type FixIssueFormProps = {
  issue: IssueReport;
  onSubmit: (
    issueId: string,
    afterPhotoUri?: string,
    fixVerification?: PhotoVerificationResult,
    fixDescription?: string,
  ) => void;
};

export function FixIssueForm({ issue, onSubmit }: FixIssueFormProps) {
  const [afterPhotoUri, setAfterPhotoUri] = useState<string | null>(null);
  const [fixDescription, setFixDescription] = useState<string>('');
  const [verification, setVerification] = useState<PhotoVerificationResult | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdictModalVisible, setVerdictModalVisible] = useState(false);

  if (issue.status === 'fixed') {
    return null;
  }

  async function openCamera() {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setAfterPhotoUri(result.assets[0].uri);
  }

  async function openGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setAfterPhotoUri(result.assets[0].uri);
  }

  function presentImagePicker() {
    Alert.alert('Attach Photo', 'Choose a photo source', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  async function handleSubmit() {
    if (!afterPhotoUri) {
      Alert.alert('Missing Photo', 'Please attach an after photo to submit.');
      return;
    }

    setIsSubmitting(true);
    let finalAfterPhotoUri = afterPhotoUri;

    if (afterPhotoUri && !afterPhotoUri.startsWith('demo://')) {
      const uploaded = await uploadImage(afterPhotoUri, 'issue-images', `issue_fix_${Date.now()}.jpg`);
      if (uploaded) finalAfterPhotoUri = uploaded;
    }

    let fixVerification: PhotoVerificationResult | undefined;
    if (issue.photoUri && finalAfterPhotoUri) {
      fixVerification = await verifyIssueFixBeforeAfter({
        beforeImageUri: issue.photoUri,
        afterImageUri: finalAfterPhotoUri,
        selectedCategory: issue.category,
        originalTitle: issue.title,
        originalDescription: issue.description,
        fixDescription: fixDescription,
      });
    }

    setVerification(fixVerification);

    if (fixVerification && !fixVerification.isValid) {
      setVerdictModalVisible(true);
      setIsSubmitting(false);
      return;
    }

    onSubmit(issue.id, finalAfterPhotoUri, fixVerification, fixDescription);
    setIsSubmitting(false);
  }

  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold">Fix Issue</ThemedText>
      <ThemedText>Add an after photo to verify cleanup before marking fixed.</ThemedText>
      <Pressable style={styles.photoContainer} onPress={presentImagePicker} disabled={isSubmitting}>
        {afterPhotoUri ? (
          <Image source={{ uri: afterPhotoUri }} style={styles.photoImage} contentFit="contain" />
        ) : (
          <View style={styles.photoPlaceholder}>
            <ThemedText style={styles.photoHint}>📷 Tap to attach after photo</ThemedText>
          </View>
        )}
      </Pressable>
      <TextInput
        style={styles.input}
        placeholder="Describe how it was fixed..."
        placeholderTextColor="#94A3B8"
        value={fixDescription}
        onChangeText={setFixDescription}
        multiline
        editable={!isSubmitting}
      />
      <VerificationBadge verification={verification} />
      <VerificationWarning verification={verification} />
      <GlossyButton
        label={isSubmitting ? 'Verifying...' : 'Mark fixed'}
        onPress={handleSubmit}
        tone="secondary"
        disabled={isSubmitting}
      />

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
    paddingTop: 8,
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
  photoHint: {
    color: '#64748B',
  },
  input: {
    minHeight: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0F172A',
    textAlignVertical: 'top',
  },
});
