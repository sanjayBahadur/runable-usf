import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { RUNABLE_THEME } from '@/src/constants/theme';

type RunableCardProps = {
  children: ReactNode;
};

export function RunableCard({ children }: RunableCardProps) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    padding: RUNABLE_THEME.spacing.md,
    borderRadius: RUNABLE_THEME.radii.md,
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
    ...RUNABLE_THEME.shadows.soft,
  },
});
