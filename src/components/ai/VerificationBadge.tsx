import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { PhotoVerificationResult } from '@/src/types';

type VerificationBadgeProps = {
  verification?: PhotoVerificationResult;
};

export function VerificationBadge({ verification }: VerificationBadgeProps) {
  if (!verification) return null;

  const tone =
    verification.status === 'verified'
      ? styles.verified
      : verification.status === 'uncertain'
        ? styles.uncertain
        : styles.manual;
  const label =
    verification.status === 'verified'
      ? 'Verified'
      : verification.status === 'uncertain'
        ? 'Uncertain'
        : 'Manual review';

  return (
    <View style={[styles.badge, tone]}>
      <ThemedText style={styles.text}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  verified: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  uncertain: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  manual: {
    backgroundColor: '#E2E8F0',
    borderColor: '#64748B',
  },
  text: {
    fontSize: 12,
    color: '#0F172A',
  },
});
