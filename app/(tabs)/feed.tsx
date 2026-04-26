import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { FeedItemCard, FeedTabs } from '@/src/components/feed';
import {
  GroupLeaderboard,
  LeaderboardTabs,
  type LeaderboardTabKey,
  UserLeaderboard,
} from '@/src/components/leaderboard';
import { AppShell } from '@/src/components/layout';
import { RunableCard, StatTile, XPWindow } from '@/src/components/ui';
import { demoGroups } from '@/src/demo';
import { buildDemoFeedEvents, getDemoUserNames, getVisibleFeedItems } from '@/src/lib/feed';
import { buildDemoLeaderboards } from '@/src/lib/leaderboard';
import { getScopedFeedItems } from '@/src/lib/supabase';
import { useAuth } from '@/src/hooks/useAuth';
import type { FeedItem } from '@/src/types';

export default function FeedScreen() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboards'>('feed');
  const [activeLeaderboard, setActiveLeaderboard] = useState<LeaderboardTabKey>('topGroups');
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, string[]>>({
    'feed-art-demo': ['Nice paint coverage.', 'Keep the Bulls cells bright.'],
  });

  const userNames = useMemo(() => getDemoUserNames(demoGroups), []);
  const feedItems = useMemo(() => getVisibleFeedItems(buildDemoFeedEvents()), []);
  const [globalFeedItems, setGlobalFeedItems] = useState<FeedItem[]>([]);
  const currentGroupId = auth.user?.homeGroupId ?? 'group-bulls';
  const currentUserId = auth.user?.id ?? 'user-bulls-demo';

  useEffect(() => {
    void getScopedFeedItems({ scope: 'global', currentGroupId }).then((rows) => setGlobalFeedItems(rows));
  }, [currentGroupId]);

  const visibleGlobalFeed = globalFeedItems.length > 0 ? globalFeedItems : feedItems;
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
    <AppShell>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <XPWindow title="Campus Pulse" icon="📡">
            <View style={styles.headerBody}>
              <ThemedText>
                Local demo feed and leaderboards built from runs, claims, issues, sightings, and art.
              </ThemedText>
            </View>
          </XPWindow>

          <FeedTabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'feed' ? (
            <View style={styles.section}>
              {visibleGlobalFeed.map((item) => (
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
              <RunableCard>
                <View style={styles.statsRow}>
                  <StatTile label="Events" value={leaderboards.feedCount} />
                  <StatTile label="Groups" value={leaderboards.topGroups.length} />
                  <StatTile label="Users" value={leaderboards.topUsers.length} />
                </View>
              </RunableCard>
              <LeaderboardTabs activeTab={activeLeaderboard} onChange={setActiveLeaderboard} />
              {leaderboardContent}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: RUNABLE_THEME.spacing.md,
    padding: RUNABLE_THEME.spacing.md,
    paddingBottom: RUNABLE_THEME.spacing.xl,
  },
  headerBody: {
    gap: RUNABLE_THEME.spacing.xs,
  },
  section: {
    gap: RUNABLE_THEME.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: RUNABLE_THEME.spacing.sm,
  },
});
