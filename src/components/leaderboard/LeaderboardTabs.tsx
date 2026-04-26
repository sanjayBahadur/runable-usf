import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';

export type LeaderboardTabKey =
  | 'topGroups'
  | 'topUsers'
  | 'mostIssuesFixed'
  | 'mostCellsOwned'
  | 'mostSightingsAdded';

type LeaderboardTabsProps = {
  activeTab: LeaderboardTabKey;
  onChange: (tab: LeaderboardTabKey) => void;
};

const tabs: { key: LeaderboardTabKey; label: string }[] = [
  { key: 'topGroups', label: 'Groups' },
  { key: 'topUsers', label: 'Users' },
  { key: 'mostIssuesFixed', label: 'Fixes' },
  { key: 'mostCellsOwned', label: 'Cells' },
  { key: 'mostSightingsAdded', label: 'Sights' },
];

export function LeaderboardTabs({ activeTab, onChange }: LeaderboardTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onChange(tab.key)}
          style={({ pressed }) => [
            styles.tab,
            activeTab === tab.key ? styles.activeTab : styles.inactiveTab,
            pressed ? styles.pressed : null,
          ]}>
          <ThemedText
            type="defaultSemiBold"
            lightColor={activeTab === tab.key ? '#F8FAFC' : RUNABLE_THEME.colors.ink}
            darkColor={activeTab === tab.key ? '#F8FAFC' : '#CBD5E1'}>
            {tab.label}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: RUNABLE_THEME.spacing.xs,
    paddingVertical: 2,
  },
  tab: {
    paddingHorizontal: RUNABLE_THEME.spacing.sm,
    paddingVertical: 10,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
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
