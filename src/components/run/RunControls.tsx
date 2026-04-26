import { StyleSheet, View } from 'react-native';

import { GlossyButton } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { RunTrackerStatus } from '@/src/hooks/useRunTracker';

type RunControlsProps = {
  status: RunTrackerStatus;
  onStartRun: () => void;
  onPauseRun: () => void;
  onResumeRun: () => void;
  onFinishRun: () => void;
  onCancelRun: () => void;
};

export function RunControls({
  status,
  onStartRun,
  onPauseRun,
  onResumeRun,
  onFinishRun,
  onCancelRun,
}: RunControlsProps) {
  if (status === 'idle' || status === 'finished') {
    return <GlossyButton label="Start Run" onPress={onStartRun} tone="primary" />;
  }

  if (status === 'permissionDenied' || status === 'error') {
    return (
      <View style={styles.row}>
        <GlossyButton label="Try Again" onPress={onStartRun} tone="primary" />
        <GlossyButton label="Close" onPress={onCancelRun} tone="secondary" />
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {status === 'recording' ? (
        <GlossyButton label="Pause" onPress={onPauseRun} tone="secondary" />
      ) : (
        <GlossyButton label="Resume" onPress={onResumeRun} tone="primary" />
      )}
      <GlossyButton label="Finish" onPress={onFinishRun} tone="dark" />
      <GlossyButton label="Cancel" onPress={onCancelRun} tone="danger" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: RUNABLE_THEME.spacing.sm,
  },
});
