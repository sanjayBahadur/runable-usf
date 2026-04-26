import { ScrollView, StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { AppShell } from '@/src/components/layout';
import { RunableCard, XPWindow } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { DEVELOPMENT_LOG } from '@/src/constants';
import { useArchives } from '@/src/hooks/useArchives';
import { ArchiveCard } from '@/src/components/archive';
import { GlossyButton } from '@/src/components/ui';
import { runDemoTerritoryScenario } from '@/src/demo';
import { getActivePeriod } from '@/src/lib/periods';

export default function DevelopmentLogScreen() {
  const { archives, createArchive } = useArchives();
  const demoScenario = runDemoTerritoryScenario();

  function handleFinalize(cycle: any) {
    // Map demoScenario.ownership (CellOwnership[]) to Record<string, string>
    const ownershipRecord: Record<string, string> = {};
    demoScenario.ownership.forEach(o => {
      ownershipRecord[o.cellId] = o.groupId;
    });

    createArchive(
      cycle,
      demoScenario.groups.map(g => ({
        entityId: g.id,
        entityType: 'group',
        displayName: g.name,
        points: demoScenario.scores.filter(s => s.groupId === g.id).reduce((sum, s) => sum + s.score, 0),
        rank: 1,
      })),
      ownershipRecord,
      {}, // Art snapshot empty for MVP demo
      demoScenario.issues.length,
      demoScenario.sightings.length
    );
  }

  return (
    <AppShell>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <XPWindow title="Development Log" icon="📋">
            <ThemedText>
              Checklist history for the implemented modules. This screen
              tracks build progress across all Runable systems.
            </ThemedText>
          </XPWindow>

          {DEVELOPMENT_LOG.map((entry) => (
            <RunableCard key={entry.module}>
              <View style={styles.cardHeader}>
                <ThemedText type="defaultSemiBold" style={styles.moduleLabel}>
                  {entry.module}
                </ThemedText>
                <ThemedText type="defaultSemiBold">{entry.title}</ThemedText>
              </View>
              {entry.checklist.map((item) => (
                <View key={item} style={styles.checkRow}>
                  <View style={styles.checkBox}>
                    <ThemedText style={styles.checkMark}>✓</ThemedText>
                  </View>
                  <ThemedText style={styles.checkText}>{item}</ThemedText>
                </View>
              ))}
            </RunableCard>
          ))}

          <XPWindow title="MVP Archive Controls" icon="⚙️">
            <ThemedText style={{ marginBottom: RUNABLE_THEME.spacing.sm }}>
              Current Period: <ThemedText type="defaultSemiBold">{getActivePeriod()}</ThemedText>
            </ThemedText>
            <View style={styles.buttonCol}>
              <GlossyButton 
                label="Finalize Current Period" 
                onPress={() => handleFinalize('Period')} 
                tone="primary" 
              />
              <GlossyButton 
                label="Finalize Daily Cycle" 
                onPress={() => handleFinalize('Daily')} 
                tone="dark" 
              />
              <GlossyButton 
                label="Finalize Weekly Cycle" 
                onPress={() => handleFinalize('Weekly')} 
                tone="dark" 
              />
            </View>
          </XPWindow>

          {archives.length > 0 && (
            <View style={{ gap: RUNABLE_THEME.spacing.md }}>
              <ThemedText type="subtitle">Snapshot History</ThemedText>
              {archives.map((snapshot) => {
                const group = demoScenario.groups.find(g => g.id === snapshot.winnerGroupId);
                return (
                  <ArchiveCard 
                    key={snapshot.id} 
                    snapshot={snapshot} 
                    groupName={group?.name || 'Unknown Group'} 
                  />
                );
              })}
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
  cardHeader: {
    flexDirection: 'row',
    gap: RUNABLE_THEME.spacing.sm,
    alignItems: 'center',
    marginBottom: RUNABLE_THEME.spacing.xs,
  },
  moduleLabel: {
    fontSize: RUNABLE_THEME.fontSizes.xs,
    paddingHorizontal: RUNABLE_THEME.spacing.xs,
    paddingVertical: 2,
    backgroundColor: RUNABLE_THEME.colors.xpBlue,
    color: '#F8FAFC',
    borderRadius: RUNABLE_THEME.radii.sm,
    overflow: 'hidden',
  },
  checkRow: {
    flexDirection: 'row',
    gap: RUNABLE_THEME.spacing.xs,
    alignItems: 'flex-start',
    marginTop: 4,
  },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
    backgroundColor: RUNABLE_THEME.colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkMark: {
    fontSize: 11,
    lineHeight: 14,
    color: RUNABLE_THEME.colors.campusGreen,
    fontWeight: '800',
  },
  checkText: {
    fontSize: RUNABLE_THEME.fontSizes.sm,
    lineHeight: 20,
  },
  buttonCol: {
    gap: RUNABLE_THEME.spacing.sm,
  },
});
