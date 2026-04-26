import { FontAwesome5 } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IssueCard } from '@/src/components/issues';
import { AppShell } from '@/src/components/layout';
import { XPWindow } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { runDemoTerritoryScenario } from '@/src/demo';
import { useAuth } from '@/src/hooks/useAuth';
import { useIssueReports } from '@/src/hooks/useIssueReports';

export default function ResolvedIssuesScreen() {
  const { user, isAuthenticated } = useAuth();


  const demoScenario = runDemoTerritoryScenario();

  const { issues, reportFalseCompletion } = useIssueReports({
    initialIssues: isAuthenticated ? [] : demoScenario.issues,
    currentUserId: user?.id ?? 'guest',
    currentUserGroupId: user?.homeGroupId ?? 'spectator',
    enabled: isAuthenticated,
  });

  async function handleReportFalseCompletion(issueId: string, description: string) {
    const result = await reportFalseCompletion(issueId, description);
    if (!result) return;

    if (result.falseCompletionRecord.isVerified) {
      Alert.alert(
        'False Completion Verified',
        `Gemini agreed: "${result.falseCompletionRecord.verificationResult?.explanation}". The issue has been reopened.`,
      );
    } else {
      Alert.alert(
        'Report Rejected',
        `Gemini reviewed the fix and determined it is valid: "${result.falseCompletionRecord.verificationResult?.explanation}"`,
      );
    }
  }

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
                <IssueCard
                  issue={issue}
                  onReportFalseCompletion={handleReportFalseCompletion}
                />
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
