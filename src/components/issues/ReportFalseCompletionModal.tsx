import { useState } from 'react';
import { Modal, StyleSheet, View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { GlossyButton } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';

type ReportFalseCompletionModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (description: string) => Promise<void>;
};

export function ReportFalseCompletionModal({ visible, onClose, onSubmit }: ReportFalseCompletionModalProps) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!description.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(description);
      setDescription('');
      onClose();
    } catch {
      // Ensure we don't block forever if it fails
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="warning" size={24} color="#EF4444" />
              <ThemedText type="subtitle">Report False Fix</ThemedText>
            </View>
            <Pressable onPress={onClose} disabled={isSubmitting}>
              <Ionicons name="close" size={24} color="#64748B" />
            </Pressable>
          </View>
          
          <ThemedText>
            Explain why you believe this issue wasn't properly fixed. Our AI will analyze your description against before/after images.
          </ThemedText>

          <TextInput
            style={styles.input}
            placeholder="It looks like the trash was just pushed out of frame..."
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
            multiline
            editable={!isSubmitting}
            autoFocus
          />

          <View style={styles.actions}>
            <GlossyButton
              label={isSubmitting ? "Submitting..." : "Report"}
              onPress={handleSubmit}
              disabled={isSubmitting || !description.trim()}
              tone="danger"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    minHeight: 100,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0F172A',
    textAlignVertical: 'top',
  },
  actions: {
    marginTop: 8,
  },
});
