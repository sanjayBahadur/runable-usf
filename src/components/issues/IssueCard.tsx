import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BeforeAfterViewer } from '@/src/components/issues/BeforeAfterViewer';
import { FixIssueForm } from '@/src/components/issues/FixIssueForm';
import { PixelChip } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { IssueReport } from '@/src/types';

type IssueCardProps = {
  issue: IssueReport;
  onFixIssue?: (issueId: string, afterPhotoUri?: string) => void;
};

export function IssueCard({ issue, onFixIssue }: IssueCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="subtitle">{issue.title}</ThemedText>
        <PixelChip label={issue.status} tone={issue.status === 'fixed' ? 'green' : 'gold'} />
      </View>
      <View style={styles.metaRow}>
        <PixelChip label={issue.category} tone="neutral" />
      </View>
      {issue.description ? <ThemedText>{issue.description}</ThemedText> : null}
      <BeforeAfterViewer issue={issue} />
      {onFixIssue ? <FixIssueForm issue={issue} onSubmit={onFixIssue} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: RUNABLE_THEME.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    gap: RUNABLE_THEME.spacing.xs,
  },
});
