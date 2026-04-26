import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { FeedItemCard, FeedTabs } from '@/src/components/feed';
import {
  GroupLeaderboard,
  LeaderboardTabs,
  type LeaderboardTabKey,
  UserLeaderboard,
} from '@/src/components/leaderboard';
import { demoGroups } from '@/src/demo';
import { buildDemoFeedEvents, getDemoUserNames, getVisibleFeedItems } from '@/src/lib/feed';
import { buildDemoLeaderboards } from '@/src/lib/leaderboard';

const currentGroupId = 'group-bulls';
const currentUserId = 'user-bulls-demo';

export default function FeedScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboards'>('feed');
  const [activeLeaderboard, setActiveLeaderboard] = useState<LeaderboardTabKey>('topGroups');
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, string[]>>({
    'feed-art-demo': ['Nice paint coverage.', 'Keep the Bulls cells bright.'],
  });

  const userNames = useMemo(() => getDemoUserNames(demoGroups), []);
  const feedItems = useMemo(() => getVisibleFeedItems(buildDemoFeedEvents()), []);
  const leaderboards = useMemo(() => buildDemoLeaderboards(feedItems, userNames), [feedItems, userNames]);

  function toggleLike(feedItemId: string) {
    setLiked((existing) => ({ ...existing, [feedItemId]: !existing[feedItemId] }));
    setLikes((existing) => ({
      ...existing,
      [feedItemId]: Math.max(0, (existing[feedItemId] ?? 0) + (liked[feedItemId] ? -1 : 1)),
    }));
  }

  function addComment(feedItemId: string, comment: string) {
    setComments((existing) => ({
      ...existing,
      [feedItemId]: [...(existing[feedItemId] ?? []), comment],
    }));
  }

  const leaderboardContent = (() => {
    switch (activeLeaderboard) {
      case 'topGroups':
        return <GroupLeaderboard entries={leaderboards.topGroups} currentGroupId={currentGroupId} />;
      case 'topUsers':
        return <UserLeaderboard entries={leaderboards.topUsers} currentUserId={currentUserId} />;
      case 'mostIssuesFixed':
        return <UserLeaderboard entries={leaderboards.mostIssuesFixed} currentUserId={currentUserId} />;
      case 'mostCellsOwned':
        return <GroupLeaderboard entries={leaderboards.mostCellsOwned} currentGroupId={currentGroupId} />;
      case 'mostSightingsAdded':
        return <UserLeaderboard entries={leaderboards.mostSightingsAdded} currentUserId={currentUserId} />;
    }
  })();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Campus Pulse</ThemedText>
          <ThemedText>
            Local demo feed and leaderboards built from runs, claims, issues, sightings, and art.
          </ThemedText>
        </View>

        <FeedTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'feed' ? (
          <View style={styles.section}>
            <ThemedText type="subtitle">Activity Feed</ThemedText>
            {feedItems.map((item) => (
              <FeedItemCard
                key={item.id}
                item={item}
                liked={Boolean(liked[item.id])}
                likeCount={likes[item.id] ?? 0}
                comments={comments[item.id] ?? []}
                actorName={userNames.get(item.actorUserId)}
                onToggleLike={() => toggleLike(item.id)}
                onAddComment={(comment) => addComment(item.id, comment)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.statsCard}>
              <ThemedText type="defaultSemiBold">Leaderboard Snapshot</ThemedText>
              <ThemedText>Feed events: {leaderboards.feedCount}</ThemedText>
              <ThemedText>Groups tracked: {leaderboards.topGroups.length}</ThemedText>
              <ThemedText>Users ranked: {leaderboards.topUsers.length}</ThemedText>
            </View>
            <LeaderboardTabs activeTab={activeLeaderboard} onChange={setActiveLeaderboard} />
            {leaderboardContent}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 14,
    padding: 16,
  },
  header: {
    gap: 8,
  },
  section: {
    gap: 12,
  },
  statsCard: {
    gap: 8,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 103, 71, 0.08)',
  },
});
