import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';

type XPTitleBarProps = {
  title: string;
  icon?: string;
  action?: ReactNode;
};

export function XPTitleBar({ title, icon, action }: XPTitleBarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.titleWrap}>
        <View style={styles.controls}>
          <View style={styles.controlLight} />
          <View style={styles.controlDark} />
        </View>
        <ThemedText type="defaultSemiBold" lightColor="#F8FAFC" darkColor="#F8FAFC">
          {icon ? `${icon} ${title}` : title}
        </ThemedText>
      </View>
      {action ? <View>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 34,
    paddingHorizontal: RUNABLE_THEME.spacing.md,
    paddingVertical: RUNABLE_THEME.spacing.xs,
    backgroundColor: RUNABLE_THEME.colors.xpBlue,
    borderBottomWidth: 2,
    borderBottomColor: RUNABLE_THEME.colors.xpDarkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: RUNABLE_THEME.spacing.sm,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RUNABLE_THEME.spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 2,
  },
  controlLight: {
    width: 10,
    height: 10,
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderWidth: 1,
    borderColor: RUNABLE_THEME.colors.border,
  },
  controlDark: {
    width: 10,
    height: 10,
    backgroundColor: RUNABLE_THEME.colors.gold,
    borderWidth: 1,
    borderColor: RUNABLE_THEME.colors.border,
  },
});
