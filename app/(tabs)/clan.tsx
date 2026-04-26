import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { AppShell } from '@/src/components/layout';
import { GlossyButton, PixelChip, RunableCard, XPWindow } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { useAuth } from '@/src/hooks/useAuth';
import { getGroupMembers, getCellArt, getCellOwnership, insertFeedItem, saveCellArt } from '@/src/lib/supabase';
import type { CellArt, CellOwnership } from '@/src/types';

const CARD_OPTIONS = ['Classic', 'Neon', 'Forest', 'Sunset'] as const;
const PALETTE = ['#006747', '#CFC493', '#F97316', '#0EA5E9', '#FACC15', '#A855F7'] as const;

type EditableTile = {
  ownership: CellOwnership;
  art?: CellArt;
};

function mapOwnershipRow(row: Record<string, unknown>): CellOwnership {
  return {
    cellId: String(row.cell_id ?? ''),
    groupId: String(row.group_id ?? ''),
    periodId: String(row.period_id ?? 'current'),
    score: Number(row.score ?? 0),
    runnerUpGroupId: row.runner_up_group_id ? String(row.runner_up_group_id) : undefined,
    runnerUpScore: row.runner_up_score ? Number(row.runner_up_score) : undefined,
    sourceClaimIds: Array.isArray(row.source_claim_ids) ? (row.source_claim_ids as string[]) : [],
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function mapCellArtRow(row: Record<string, unknown>): CellArt {
  return {
    cellId: String(row.cell_id ?? ''),
    groupId: String(row.group_id ?? ''),
    color: String(row.color ?? '#334155'),
    leftCard: row.left_card ? String(row.left_card) : undefined,
    rightCard: row.right_card ? String(row.right_card) : undefined,
    patternId: row.pattern_id ? String(row.pattern_id) : undefined,
    updatedByUserId: String(row.updated_by_user_id ?? ''),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

export default function ClanScreen() {
  const auth = useAuth();
  const userId = auth.user?.id;
  const groupId = auth.user?.homeGroupId;
  const isExecutive = auth.user?.groupRole === 'executive';
  const isSoloMode = Boolean(userId && !groupId);

  const [members, setMembers] = useState<{ id: string; label: string; role: 'member' | 'executive' }[]>([]);
  const [ownership, setOwnership] = useState<CellOwnership[]>([]);
  const [cellArt, setCellArt] = useState<CellArt[]>([]);
  const [savingCellId, setSavingCellId] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      setMembers([]);
      return;
    }
    void getGroupMembers(groupId).then((rows) =>
      setMembers(
        rows.map((row) => ({
          id: row.user_id,
          label: row.display_name || row.username || row.user_id.slice(0, 8),
          role: row.role,
        })),
      ),
    );
  }, [groupId]);

  useEffect(() => {
    void getCellOwnership().then((rows) => setOwnership((rows as Record<string, unknown>[]).map(mapOwnershipRow)));
    void getCellArt().then((rows) => setCellArt((rows as Record<string, unknown>[]).map(mapCellArtRow)));
  }, []);

  const ownerEntityId = groupId ?? userId;
  const editableTiles = useMemo<EditableTile[]>(() => {
    if (!ownerEntityId) return [];

    const byCellArt = new Map(cellArt.map((entry) => [entry.cellId, entry]));
    return ownership
      .filter((entry) => entry.groupId === ownerEntityId)
      .filter((entry) => (entry.sourceClaimIds?.length ?? 0) > 0)
      .filter((entry) => (entry.runnerUpScore ?? 0) <= 0)
      .map((entry) => ({
        ownership: entry,
        art: byCellArt.get(entry.cellId),
      }));
  }, [cellArt, ownerEntityId, ownership]);

  async function saveTileStyle(input: {
    cellId: string;
    color: string;
    leftCard: string;
    rightCard: string;
  }) {
    if (!userId || !ownerEntityId) {
      Alert.alert('Sign in required', 'Sign in before customizing territory.');
      return;
    }
    if (groupId && !isExecutive) {
      Alert.alert('Executive only', 'Only executives can customize clan territory.');
      return;
    }

    setSavingCellId(input.cellId);
    const ok = await saveCellArt({
      cell_id: input.cellId,
      group_id: ownerEntityId,
      color: input.color,
      left_card: input.leftCard,
      right_card: input.rightCard,
      updated_by_user_id: userId,
    });
    setSavingCellId(null);

    if (!ok) {
      Alert.alert('Save failed', 'Could not save tile style. Check Supabase policies.');
      return;
    }

    setCellArt((existing) => {
      const next: CellArt = {
        cellId: input.cellId,
        groupId: ownerEntityId,
        color: input.color,
        leftCard: input.leftCard,
        rightCard: input.rightCard,
        updatedByUserId: userId,
        updatedAt: new Date().toISOString(),
      };
      const idx = existing.findIndex((item) => item.cellId === input.cellId);
      if (idx === -1) return [...existing, next];
      const copy = [...existing];
      copy[idx] = next;
      return copy;
    });

    if (groupId) {
      void insertFeedItem({
        type: 'art_updated',
        actor_user_id: userId,
        group_id: groupId,
        title: 'Clan tile style updated',
        body: `Updated ${input.cellId} with ${input.leftCard}/${input.rightCard} cards.`,
        related_entity_id: input.cellId,
        visibility_scope: 'group',
        target_group_id: groupId,
        created_at: new Date().toISOString(),
      });
    }
    Alert.alert('Saved', `Tile ${input.cellId} updated.`);
  }

  return (
    <AppShell>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <XPWindow title="Territory Studio" icon="🎨">
            <ThemedText>
              Customize owned loop tiles with richer controls. Only non-overlapped tiles from completed laps are editable.
            </ThemedText>
            {groupId ? (
              <View style={styles.statusRow}>
                <PixelChip label={isExecutive ? 'Executive' : 'Member'} tone={isExecutive ? 'green' : 'blue'} />
                <ThemedText style={styles.meta}>Group mode: {groupId}</ThemedText>
              </View>
            ) : (
              <View style={styles.statusRow}>
                <PixelChip label="No clan" tone="gold" />
                <ThemedText style={styles.meta}>Solo mode enabled (edit your own uncontested tiles only).</ThemedText>
              </View>
            )}
          </XPWindow>

          {groupId ? (
            <RunableCard>
              <ThemedText type="defaultSemiBold">Members</ThemedText>
              <View style={styles.memberList}>
                {members.length === 0 ? (
                  <ThemedText style={styles.meta}>No members found.</ThemedText>
                ) : (
                  members.map((member) => (
                    <View key={member.id} style={styles.memberRow}>
                      <ThemedText>{member.label}</ThemedText>
                      <PixelChip label={member.role} tone={member.role === 'executive' ? 'green' : 'neutral'} />
                    </View>
                  ))
                )}
              </View>
            </RunableCard>
          ) : null}

          {!auth.user ? (
            <RunableCard>
              <ThemedText type="defaultSemiBold">Not signed in</ThemedText>
              <ThemedText style={styles.meta}>Sign in to access clan or solo territory customization.</ThemedText>
            </RunableCard>
          ) : editableTiles.length === 0 ? (
            <RunableCard>
              <ThemedText type="defaultSemiBold">No editable tiles yet</ThemedText>
              <ThemedText style={styles.meta}>
                Complete laps to claim territory. Tiles become editable only when they are owned and not overlapped.
              </ThemedText>
            </RunableCard>
          ) : (
            <View style={styles.section}>
              <ThemedText type="subtitle">Claimed Tiles</ThemedText>
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tilePager}>
                {editableTiles.map((tile) => (
                  <TileEditorCard
                    key={tile.ownership.cellId}
                    tile={tile}
                    canEdit={Boolean(isSoloMode || isExecutive)}
                    isSaving={savingCellId === tile.ownership.cellId}
                    onSave={saveTileStyle}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </AppShell>
  );
}

function TileEditorCard({
  tile,
  canEdit,
  isSaving,
  onSave,
}: {
  tile: EditableTile;
  canEdit: boolean;
  isSaving: boolean;
  onSave: (input: { cellId: string; color: string; leftCard: string; rightCard: string }) => void;
}) {
  const [color, setColor] = useState(tile.art?.color ?? PALETTE[0]);
  const [leftCard, setLeftCard] = useState(tile.art?.leftCard ?? CARD_OPTIONS[0]);
  const [rightCard, setRightCard] = useState(tile.art?.rightCard ?? CARD_OPTIONS[1]);

  return (
    <RunableCard style={styles.tileCard}>
      <View style={styles.tileHeader}>
        <ThemedText type="defaultSemiBold">{tile.ownership.cellId}</ThemedText>
        <PixelChip label={`Score ${Math.round(tile.ownership.score)}`} tone="blue" />
      </View>
      <ThemedText style={styles.meta}>Swipe between cards to style claimed territory</ThemedText>

      <View style={styles.paletteRow}>
        {PALETTE.map((swatch) => (
          <Pressable
            key={swatch}
            onPress={() => setColor(swatch)}
            style={[
              styles.swatch,
              { backgroundColor: swatch },
              color === swatch ? styles.swatchSelected : null,
            ]}
          />
        ))}
      </View>

      <View style={styles.cardRow}>
        {CARD_OPTIONS.map((option) => (
          <GlossyButton
            key={`left-${option}`}
            label={`L:${option}`}
            onPress={() => setLeftCard(option)}
            tone={leftCard === option ? 'primary' : 'secondary'}
            compact
          />
        ))}
      </View>
      <View style={styles.cardRow}>
        {CARD_OPTIONS.map((option) => (
          <GlossyButton
            key={`right-${option}`}
            label={`R:${option}`}
            onPress={() => setRightCard(option)}
            tone={rightCard === option ? 'primary' : 'secondary'}
            compact
          />
        ))}
      </View>

      <GlossyButton
        label={isSaving ? 'Saving...' : canEdit ? 'Save Tile Style' : 'Executive access required'}
        onPress={() => onSave({ cellId: tile.ownership.cellId, color, leftCard, rightCard })}
        tone="dark"
        disabled={!canEdit || isSaving}
      />
    </RunableCard>
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
  section: {
    gap: RUNABLE_THEME.spacing.sm,
  },
  statusRow: {
    marginTop: RUNABLE_THEME.spacing.sm,
    flexDirection: 'row',
    gap: RUNABLE_THEME.spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  meta: {
    color: '#64748B',
    fontSize: 12,
  },
  memberList: {
    marginTop: RUNABLE_THEME.spacing.sm,
    gap: 8,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tilePager: {
    gap: RUNABLE_THEME.spacing.sm,
  },
  tileCard: {
    width: 320,
    gap: RUNABLE_THEME.spacing.sm,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
  },
  swatchSelected: {
    borderColor: RUNABLE_THEME.colors.xpBlue,
    transform: [{ scale: 1.1 }],
  },
});
