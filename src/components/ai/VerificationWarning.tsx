import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { PhotoVerificationResult } from '@/src/types';

type VerificationWarningProps = {
  verification?: PhotoVerificationResult;
};

export function VerificationWarning({ verification }: VerificationWarningProps) {
  if (!verification || verification.status === 'verified') return null;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>
        {verification.status === 'manual-review' ? 'Manual review recommended' : 'Verification uncertain'}
      </ThemedText>
      <ThemedText style={styles.body}>{verification.explanation}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FFFBEB',
    gap: 4,
  },
  title: {
    fontSize: 12,
    color: '#92400E',
  },
  body: {
    fontSize: 12,
    color: '#78350F',
  },
});
