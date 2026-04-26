import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { RUNABLE_THEME } from '@/src/constants/theme';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return <View style={styles.shell}>{children}</View>;
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: RUNABLE_THEME.colors.navy,
  },
});
