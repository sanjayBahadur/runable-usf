import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { USF_CAMERA_PADDING } from '@/src/constants';
import { RUNABLE_THEME } from '@/src/constants/theme';

type MapOverlayShellProps = {
  top?: ReactNode;
  toast?: ReactNode;
  panel?: ReactNode;
  dock?: ReactNode;
  gate?: ReactNode;
};

export function MapOverlayShell({
  top,
  toast,
  panel,
  dock,
  gate,
}: MapOverlayShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {top ? <View style={[styles.top, { top: insets.top + 10 }]}>{top}</View> : null}
      {toast ? (
        <View style={[styles.toast, { bottom: insets.bottom + USF_CAMERA_PADDING.bottom + 10 }]}>
          {toast}
        </View>
      ) : null}
      {panel ? (
        <View style={[styles.panel, { bottom: insets.bottom + USF_CAMERA_PADDING.bottom - 8 }]}>
          {panel}
        </View>
      ) : null}
      {dock ? (
        <View style={[styles.dock, { bottom: insets.bottom + 78 }]}>
          {dock}
        </View>
      ) : null}
      {gate}
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    left: USF_CAMERA_PADDING.left,
    right: USF_CAMERA_PADDING.right,
    gap: RUNABLE_THEME.spacing.sm,
    zIndex: RUNABLE_THEME.zIndex.hud,
  },
  toast: {
    position: 'absolute',
    left: USF_CAMERA_PADDING.left,
    right: USF_CAMERA_PADDING.right,
    zIndex: RUNABLE_THEME.zIndex.hud,
  },
  panel: {
    position: 'absolute',
    left: USF_CAMERA_PADDING.left,
    right: USF_CAMERA_PADDING.right,
    maxHeight: '44%',
    zIndex: RUNABLE_THEME.zIndex.panel,
  },
  dock: {
    position: 'absolute',
    left: USF_CAMERA_PADDING.left,
    right: USF_CAMERA_PADDING.right,
    zIndex: RUNABLE_THEME.zIndex.dock,
  },
});
