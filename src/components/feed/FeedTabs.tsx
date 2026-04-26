import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

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
          style={[styles.tab, activeTab === tab ? styles.activeTab : undefined]}>
          <ThemedText>{tab === 'feed' ? 'Feed' : 'Leaderboards'}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
  },
  activeTab: {
    backgroundColor: 'rgba(14, 165, 233, 0.16)',
  },
});
