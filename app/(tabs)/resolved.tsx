import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { AppShell } from '@/src/components/layout';
import { IssueCard } from '@/src/components/issues';
import { XPWindow } from '@/src/components/ui';
import { runDemoTerritoryScenario } from '@/src/demo';
import { useAuth } from '@/src/hooks/useAuth';
import { useIssueReports } from '@/src/hooks/useIssueReports';
import { RUNABLE_THEME } from '@/src/constants/theme';

export default function ResolvedIssuesScreen() {
  const { user, group } = useAuth();
  

  const demoScenario = runDemoTerritoryScenario();
  
  const { issues } = useIssueReports({
    initialIssues: demoScenario.issues,
    currentUserId: user?.id ?? 'guest',
    currentUserGroupId: group?.id ?? 'spectator',
  });

  const resolvedIssues = useMemo(() => {
    return issues
      .filter((i) => i.status === 'fixed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [issues]);

  return (
    <AppShell>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <XPWindow title="Archive" action={<FontAwesome5 name="archive" size={16} />}>
            <ThemedText>
              History of all resolved campus requests. These pins are no longer active on the map, but their contribution points remain permanently logged.
            </ThemedText>
          </XPWindow>

          {resolvedIssues.length === 0 ? (
            <View style={styles.emptyWrap}>
              <ThemedText style={{ color: '#64748B' }}>No resolved issues found.</ThemedText>
            </View>
          ) : (
            resolvedIssues.map((issue) => (
              <View key={issue.id} style={styles.itemWrapper}>
                <IssueCard issue={issue} />
              </View>
            ))
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
  itemWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: RUNABLE_THEME.radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: RUNABLE_THEME.colors.border,
    padding: RUNABLE_THEME.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyWrap: {
    padding: RUNABLE_THEME.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
