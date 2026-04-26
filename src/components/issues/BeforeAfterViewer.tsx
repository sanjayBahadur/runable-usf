import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { IssueReport } from '@/src/types';

type BeforeAfterViewerProps = {
  issue: IssueReport;
};

export function BeforeAfterViewer({ issue }: BeforeAfterViewerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <ThemedText type="defaultSemiBold">Before</ThemedText>
        <ThemedText>{issue.photoUri ?? 'No before photo'}</ThemedText>
      </View>
      <View style={styles.block}>
        <ThemedText type="defaultSemiBold">After</ThemedText>
        <ThemedText>{issue.afterPhotoUri ?? 'No after photo yet'}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  block: {
    gap: 4,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
  },
});
