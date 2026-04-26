import React from 'react';
import { Modal, StyleSheet, View, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { XPWindow, GlossyButton } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { PhotoVerificationResult } from '@/src/types';

type GeminiVerdictModalProps = {
  visible: boolean;
  onClose: () => void;
  result: PhotoVerificationResult | null;
  title?: string;
};

export function GeminiVerdictModal({ visible, onClose, result, title }: GeminiVerdictModalProps) {
  if (!result) return null;

  const isSuccess = result.isValid;
  const headerIcon = isSuccess ? 'check-decagram' : 'alert-decagram';
  const headerColor = isSuccess ? '#22C55E' : '#EF4444';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <XPWindow
            title={title || (isSuccess ? 'Verification Passed' : 'Verification Failed')}
            icon="✨"
            action={<GlossyButton label="Close" onPress={onClose} compact tone="secondary" />}
          >
            <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
              <View style={styles.header}>
                <MaterialCommunityIcons name={headerIcon} size={48} color={headerColor} />
                <ThemedText type="subtitle" style={{ color: headerColor }}>
                  {isSuccess ? 'Gemini Verified' : 'Gemini Flagged'}
                </ThemedText>
              </View>

              <View style={styles.explanationBox}>
                <ThemedText style={styles.explanationText}>
                  {result.explanation}
                </ThemedText>
              </View>

              {result.confidence !== undefined && (
                <View style={styles.confidenceRow}>
                  <ThemedText style={styles.label}>AI Confidence</ThemedText>
                  <View style={styles.progressBarBg}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { width: `${result.confidence * 100}%`, backgroundColor: headerColor }
                      ]} 
                    />
                  </View>
                </View>
              )}

              <View style={styles.btn}>
                <GlossyButton
                  label="Acknowledged"
                  onPress={onClose}
                  tone="dark"
                />
              </View>
            </ScrollView>
          </XPWindow>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  scroll: {
    maxHeight: 500,
  },
  body: {
    gap: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  explanationBox: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    borderRadius: 12,
  },
  explanationText: {
    lineHeight: 22,
    textAlign: 'center',
    fontSize: 15,
  },
  confidenceRow: {
    width: '100%',
    gap: 8,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#64748B',
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  btn: {
    width: '100%',
    marginTop: 8,
  },
});
