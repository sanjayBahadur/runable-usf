import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { VerificationBadge } from '@/src/components/ai';
import { BeforeAfterViewer } from '@/src/components/issues/BeforeAfterViewer';
import { FixIssueForm } from '@/src/components/issues/FixIssueForm';
import { PixelChip } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { IssueReport, PhotoVerificationResult } from '@/src/types';

import { IssueSocialActions } from '@/src/components/issues/IssueSocialActions';
import { ReportFalseCompletionModal } from '@/src/components/issues/ReportFalseCompletionModal';

type IssueCardProps = {
  issue: IssueReport;
  onFixIssue?: (
    issueId: string,
    afterPhotoUri?: string,
    fixVerification?: PhotoVerificationResult,
    fixDescription?: string,
  ) => void;
  onReportFalseCompletion?: (issueId: string, description: string) => Promise<void>;
};

export function IssueCard({ issue, onFixIssue, onReportFalseCompletion }: IssueCardProps) {
  const [isFalseCompletionModalVisible, setIsFalseCompletionModalVisible] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="subtitle">{issue.title}</ThemedText>
        <PixelChip label={issue.status} tone={issue.status === 'fixed' ? 'green' : 'gold'} />
      </View>
      <View style={styles.metaRow}>
        <PixelChip label={issue.category} tone="neutral" />
        {issue.isFalseCompletion ? <PixelChip label="False Fix Detected" tone="danger" /> : null}
        <VerificationBadge verification={issue.photoVerification} />
        {issue.status === 'fixed' ? <VerificationBadge verification={issue.fixVerification} /> : null}
      </View>
      {issue.description ? <ThemedText>{issue.description}</ThemedText> : null}
      {issue.status === 'fixed' && issue.fixDescription ? (
        <View style={styles.fixDescriptionContainer}>
          <ThemedText type="defaultSemiBold">Fix Details:</ThemedText>
          <ThemedText>{issue.fixDescription}</ThemedText>
        </View>
      ) : null}
      <BeforeAfterViewer issue={issue} />
      {onFixIssue && issue.status !== 'fixed' ? <FixIssueForm issue={issue} onSubmit={onFixIssue} /> : null}
      {issue.status === 'fixed' ? (
        <IssueSocialActions 
          issue={issue} 
          onReportFalseCompletion={() => setIsFalseCompletionModalVisible(true)} 
        />
      ) : null}

      <ReportFalseCompletionModal
        visible={isFalseCompletionModalVisible}
        onClose={() => setIsFalseCompletionModalVisible(false)}
        onSubmit={async (description) => {
          if (onReportFalseCompletion) {
            await onReportFalseCompletion(issue.id, description);
          }
          setIsFalseCompletionModalVisible(false);
        }}
      />
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
  fixDescriptionContainer: {
    padding: RUNABLE_THEME.spacing.sm,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    marginTop: RUNABLE_THEME.spacing.xs,
  },
});
