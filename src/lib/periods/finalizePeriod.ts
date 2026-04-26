import { ArchiveSnapshot, GameCycle, LeaderboardEntry } from '@/src/types';
import { createArchiveSnapshot } from './archiveSnapshot';

type FinalizeOptions = {
  cycle: GameCycle;
  leaderboard: LeaderboardEntry[];
  ownership: Record<string, string>;
  art: Record<string, string>;
  totalIssuesFixed: number;
  totalSightings: number;
};

export function finalizePeriod({
  cycle,
  leaderboard,
  ownership,
  art,
  totalIssuesFixed,
  totalSightings,
}: FinalizeOptions): ArchiveSnapshot {
  // Sort leaderboard to find the winner
  const sorted = [...leaderboard].sort((a, b) => b.points - a.points);
  const winner = sorted[0] || { entityId: 'nobody', points: 0 };

  // Calculate cells owned by winner
  const cellsOwnedByWinner = leaderboard.find(l => l.entityId === winner.entityId)?.points || 0; // fallback if record is cell-based

  return createArchiveSnapshot({
    cycle,
    winnerGroupId: winner.entityId,
    winnerScore: winner.points,
    totalCellsOwned: cellsOwnedByWinner,
    totalIssuesFixed,
    totalSightings,
    ownershipSnapshot: ownership,
    artSnapshot: art,
  });
}
