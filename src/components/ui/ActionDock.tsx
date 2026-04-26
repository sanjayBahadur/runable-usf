import { StyleSheet, View } from 'react-native';

import { GlossyButton } from '@/src/components/ui/GlossyButton';
import { RUNABLE_THEME } from '@/src/constants/theme';

export type ActionDockItem = {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'secondary' | 'danger' | 'dark';
};

type ActionDockProps = {
  actions: ActionDockItem[];
};

export function ActionDock({ actions }: ActionDockProps) {
  return (
    <View style={styles.dock}>
      {actions.map((action) => (
        <View key={action.label} style={styles.item}>
          <GlossyButton
            label={action.label}
            onPress={action.onPress}
            tone={action.tone ?? 'primary'}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: RUNABLE_THEME.spacing.sm,
    padding: RUNABLE_THEME.spacing.sm,
    borderRadius: RUNABLE_THEME.radii.lg,
    backgroundColor: RUNABLE_THEME.colors.panelBlack,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
    ...RUNABLE_THEME.shadows.panel,
  },
  item: {
    flexGrow: 1,
    minWidth: 72,
  },
});
