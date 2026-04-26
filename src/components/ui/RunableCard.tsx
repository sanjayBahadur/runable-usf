import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { RUNABLE_THEME } from '@/src/constants/theme';

type RunableCardProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function RunableCard({ children, style }: RunableCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
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
