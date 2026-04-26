import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { RUNABLE_THEME } from '@/src/constants/theme';

type BottomNavProps = {
  children: ReactNode;
};

export function BottomNav({ children }: BottomNavProps) {
  return <View style={styles.nav}>{children}</View>;
}

const styles = StyleSheet.create({
  nav: {
    minHeight: 72,
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderTopWidth: 2,
    borderTopColor: RUNABLE_THEME.colors.border,
  },
});
