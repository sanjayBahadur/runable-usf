import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GlossyButton, XPWindow } from '@/src/components/ui';

type CampusGateOverlayProps = {
  message: string;
  onDismiss: () => void;
};

export function CampusGateOverlay({ message, onDismiss }: CampusGateOverlayProps) {
  return (
    <View style={styles.backdrop}>
      <View style={styles.wrap}>
        <XPWindow title="Campus Access Required" icon="!" variant="light">
          <View style={styles.card}>
            <ThemedText>{message}</ThemedText>
            <GlossyButton label="Continue in preview" onPress={onDismiss} tone="secondary" />
          </View>
        </XPWindow>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.22)',
    padding: 24,
  },
  wrap: {
    width: '100%',
    maxWidth: 360,
  },
  card: {
    gap: 12,
  },
});
