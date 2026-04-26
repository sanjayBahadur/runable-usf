import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { VerificationBadge, VerificationWarning } from '@/src/components/ai';
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
  ) => void;
};

export function FixIssueForm({ issue, onSubmit }: FixIssueFormProps) {
  const [afterPhotoUri, setAfterPhotoUri] = useState<string | null>(null);
  const [verification, setVerification] = useState<PhotoVerificationResult | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (issue.status === 'fixed') {
    return null;
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setAfterPhotoUri(result.assets[0].uri);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    let finalAfterPhotoUri = afterPhotoUri ?? 'demo://issue-after-form';

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
      });
    }

    setVerification(fixVerification);
    onSubmit(issue.id, finalAfterPhotoUri, fixVerification);
    setIsSubmitting(false);
  }

  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold">Fix Issue</ThemedText>
      <ThemedText>Add an after photo to verify cleanup before marking fixed.</ThemedText>
      <Pressable style={styles.photoContainer} onPress={pickImage} disabled={isSubmitting}>
        {afterPhotoUri ? (
          <Image source={{ uri: afterPhotoUri }} style={styles.photoImage} contentFit="contain" />
        ) : (
          <View style={styles.photoPlaceholder}>
            <ThemedText style={styles.photoHint}>📷 Tap to attach after photo</ThemedText>
          </View>
        )}
      </Pressable>
      <VerificationBadge verification={verification} />
      <VerificationWarning verification={verification} />
      <GlossyButton
        label={isSubmitting ? 'Verifying...' : 'Mark fixed'}
        onPress={handleSubmit}
        tone="secondary"
        disabled={isSubmitting}
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
});
