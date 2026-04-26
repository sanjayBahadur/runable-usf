import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GlossyButton, RunableCard } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { getGroups, joinGroup, type GroupRow } from '@/src/lib/supabase/groupService';

type GroupPickerProps = {
  userId: string;
  onGroupJoined: (group: GroupRow) => void;
  onSkip: () => void;
};

export function GroupPicker({ userId, onGroupJoined, onSkip }: GroupPickerProps) {
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getGroups().then(setGroups);
  }, []);

  async function handleJoin(group: GroupRow) {
    setBusy(true);
    const ok = await joinGroup(userId, group.id);
    setBusy(false);
    if (ok) onGroupJoined(group);
  }

  return (
    <View style={styles.container}>
      {groups.length === 0 ? (
        <ThemedText style={styles.empty}>
          No groups yet. Create one from the campus board later.
        </ThemedText>
      ) : (
        groups.map((group) => (
          <Pressable
            key={group.id}
            onPress={() => { void handleJoin(group); }}
            disabled={busy}
            style={({ pressed }) => [
              styles.groupCard,
              pressed ? styles.pressed : null,
            ]}>
            <RunableCard>
              <View style={styles.groupRow}>
                <View style={[styles.swatch, { backgroundColor: group.primary_color }]} />
                <View style={styles.groupInfo}>
                  <ThemedText type="defaultSemiBold">{group.name}</ThemedText>
                  <ThemedText style={styles.meta}>
                    {group.member_count} members · {group.total_points} pts
                  </ThemedText>
                </View>
              </View>
            </RunableCard>
          </Pressable>
        ))
      )}
      <GlossyButton label="Skip for now" onPress={onSkip} tone="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: RUNABLE_THEME.spacing.sm,
  },
  groupCard: {},
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RUNABLE_THEME.spacing.sm,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
  },
  groupInfo: {
    flex: 1,
    gap: 2,
  },
  meta: {
    fontSize: RUNABLE_THEME.fontSizes.xs,
    color: RUNABLE_THEME.colors.ink,
  },
  empty: {
    color: RUNABLE_THEME.colors.ink,
    textAlign: 'center',
    padding: RUNABLE_THEME.spacing.md,
  },
  pressed: {
    transform: [{ translateY: 1 }],
  },
});
