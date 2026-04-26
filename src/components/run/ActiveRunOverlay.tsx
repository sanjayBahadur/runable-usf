import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RunControls } from '@/src/components/run/RunControls';
import { RunStatsPanel } from '@/src/components/run/RunStatsPanel';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { RunTrackerStatus } from '@/src/hooks/useRunTracker';

type ActiveRunOverlayProps = {
  status: RunTrackerStatus;
  distanceMeters: number;
  elapsedSeconds: number;
  pointCount: number;
  errorMessage?: string | null;
  onStartRun: () => void;
  onPauseRun: () => void;
  onResumeRun: () => void;
  onFinishRun: () => void;
  onCancelRun: () => void;
};

export function ActiveRunOverlay({
  status,
  distanceMeters,
  elapsedSeconds,
  pointCount,
  errorMessage,
  onStartRun,
  onPauseRun,
  onResumeRun,
  onFinishRun,
  onCancelRun,
}: ActiveRunOverlayProps) {
  return (
    <View style={styles.container}>
      <RunStatsPanel
        status={status}
        distanceMeters={distanceMeters}
        elapsedSeconds={elapsedSeconds}
        pointCount={pointCount}
      />
      {errorMessage ? <ThemedText>{errorMessage}</ThemedText> : null}
      <RunControls
        status={status}
        onStartRun={onStartRun}
        onPauseRun={onPauseRun}
        onResumeRun={onResumeRun}
        onFinishRun={onFinishRun}
        onCancelRun={onCancelRun}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: RUNABLE_THEME.spacing.sm,
  },
});
