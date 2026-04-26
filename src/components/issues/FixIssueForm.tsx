import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
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
      <Pressable
        onPress={() => onSubmit(issue.id, 'demo://issue-after-form')}
        style={styles.button}>
        <ThemedText>Mark fixed</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingTop: 8,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(22, 163, 74, 0.14)',
    alignItems: 'center',
  },
});
