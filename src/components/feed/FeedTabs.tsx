import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';

type FeedTabsProps = {
  activeTab: 'feed' | 'leaderboards';
  onChange: (tab: 'feed' | 'leaderboards') => void;
};

export function FeedTabs({ activeTab, onChange }: FeedTabsProps) {
  return (
    <View style={styles.row}>
      {(['feed', 'leaderboards'] as const).map((tab) => (
        <Pressable
          key={tab}
          onPress={() => onChange(tab)}
          style={({ pressed }) => [
            styles.tab,
            activeTab === tab ? styles.activeTab : styles.inactiveTab,
            pressed ? styles.pressed : null,
          ]}>
          <ThemedText
            type="defaultSemiBold"
            lightColor={activeTab === tab ? '#F8FAFC' : RUNABLE_THEME.colors.ink}
            darkColor={activeTab === tab ? '#F8FAFC' : '#CBD5E1'}>
            {tab === 'feed' ? 'Feed' : 'Leaderboards'}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: RUNABLE_THEME.spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
    alignItems: 'center',
    ...RUNABLE_THEME.shadows.soft,
  },
  activeTab: {
    backgroundColor: RUNABLE_THEME.colors.xpBlue,
  },
  inactiveTab: {
    backgroundColor: RUNABLE_THEME.colors.cream,
  },
  pressed: {
    transform: [{ translateY: 1 }],
  },
});
