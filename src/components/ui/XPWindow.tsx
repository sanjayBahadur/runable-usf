import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { RUNABLE_THEME } from '@/src/constants/theme';
import { XPTitleBar } from '@/src/components/ui/XPTitleBar';

type XPWindowProps = {
  title?: string;
  icon?: string;
  action?: ReactNode;
  variant?: 'light' | 'dark' | 'glass';
  children: ReactNode;
};

export function XPWindow({
  title,
  icon,
  action,
  variant = 'light',
  children,
}: XPWindowProps) {
  return (
    <View style={[styles.shell, styles[variant]]}>
      {title ? <XPTitleBar title={title} icon={icon} action={action} /> : null}
      <View style={[styles.body, !title ? styles.bodyNoTitle : null]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: RUNABLE_THEME.radii.lg,
    overflow: 'hidden',
    borderWidth: 2,
    ...RUNABLE_THEME.shadows.panel,
  },
  light: {
    backgroundColor: RUNABLE_THEME.colors.cream,
    borderColor: RUNABLE_THEME.colors.border,
  },
  dark: {
    backgroundColor: RUNABLE_THEME.colors.panelBlack,
    borderColor: RUNABLE_THEME.colors.border,
  },
  glass: {
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderColor: RUNABLE_THEME.colors.border,
  },
  body: {
    padding: RUNABLE_THEME.spacing.md,
  },
  bodyNoTitle: {
    borderRadius: RUNABLE_THEME.radii.lg,
  },
});
