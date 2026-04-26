import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BeforeAfterViewer } from '@/src/components/issues/BeforeAfterViewer';
import { FixIssueForm } from '@/src/components/issues/FixIssueForm';
import type { IssueReport } from '@/src/types';

type IssueCardProps = {
  issue: IssueReport;
  onFixIssue?: (issueId: string, afterPhotoUri?: string) => void;
};

export function IssueCard({ issue, onFixIssue }: IssueCardProps) {
  return (
    <View style={styles.card}>
      <ThemedText type="subtitle">{issue.title}</ThemedText>
      <ThemedText>Category: {issue.category}</ThemedText>
      <ThemedText>Status: {issue.status}</ThemedText>
      {issue.description ? <ThemedText>{issue.description}</ThemedText> : null}
      <BeforeAfterViewer issue={issue} />
      {onFixIssue ? <FixIssueForm issue={issue} onSubmit={onFixIssue} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
});
