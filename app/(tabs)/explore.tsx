import { ScrollView, StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { AppShell } from '@/src/components/layout';
import { RunableCard, XPWindow } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { DEVELOPMENT_LOG } from '@/src/constants';

export default function DevelopmentLogScreen() {
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
    flex: 1,
    fontSize: RUNABLE_THEME.fontSizes.sm,
    lineHeight: 20,
  },
});
