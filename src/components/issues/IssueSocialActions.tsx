import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { IssueReport } from '@/src/types';

type IssueSocialActionsProps = {
  issue: IssueReport;
  onLike?: () => void;
  onComment?: () => void;
  onReportFalseCompletion?: () => void;
};

export function IssueSocialActions({ issue, onLike, onComment, onReportFalseCompletion }: IssueSocialActionsProps) {
  if (issue.status !== 'fixed') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftActions}>
        <Pressable onPress={onLike} style={styles.actionButton}>
          <Ionicons name="heart-outline" size={20} color="#64748B" />
          <ThemedText style={styles.actionText}>{issue.likesCount ?? 0}</ThemedText>
        </Pressable>
        <Pressable onPress={onComment} style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#64748B" />
          <ThemedText style={styles.actionText}>{issue.commentsCount ?? 0}</ThemedText>
        </Pressable>
      </View>
      <Pressable onPress={onReportFalseCompletion} style={styles.actionButton}>
        <Ionicons name="flag-outline" size={20} color="#EF4444" />
        <ThemedText style={[styles.actionText, { color: '#EF4444' }]}>Report False Completion</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: RUNABLE_THEME.spacing.xs,
    borderTopWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
  },
  leftActions: {
    flexDirection: 'row',
    gap: RUNABLE_THEME.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: RUNABLE_THEME.spacing.xs,
  },
  actionText: {
    color: '#64748B',
    fontSize: 14,
  },
});
