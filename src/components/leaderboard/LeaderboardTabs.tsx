import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

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
  { key: 'topGroups', label: 'Top Groups' },
  { key: 'topUsers', label: 'Top Users' },
  { key: 'mostIssuesFixed', label: 'Issues Fixed' },
  { key: 'mostCellsOwned', label: 'Cells Owned' },
  { key: 'mostSightingsAdded', label: 'Sightings' },
];

export function LeaderboardTabs({ activeTab, onChange }: LeaderboardTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onChange(tab.key)}
          style={[styles.tab, activeTab === tab.key ? styles.activeTab : undefined]}>
          <ThemedText>{tab.label}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(15,23,42,0.08)',
  },
  activeTab: {
    backgroundColor: 'rgba(0,103,71,0.12)',
  },
});
