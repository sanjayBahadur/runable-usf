import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GlossyButton } from '@/src/components/ui';
import type { IssueReport } from '@/src/types';

type FixIssueFormProps = {
  issue: IssueReport;
  onSubmit: (issueId: string, afterPhotoUri?: string) => void;
};

export function FixIssueForm({ issue, onSubmit }: FixIssueFormProps) {
  if (issue.status === 'fixed') {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold">Fix Issue</ThemedText>
      <ThemedText>Add a demo after photo and mark this issue fixed.</ThemedText>
      <GlossyButton
        label="Mark fixed"
        onPress={() => onSubmit(issue.id, 'demo://issue-after-form')}
        tone="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingTop: 8,
  },
});
