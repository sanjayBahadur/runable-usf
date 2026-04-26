import type { CellOwnership } from '@/src/types';

import type { TerritoryCellScore } from '@/src/lib/territory/applyClaim';

export type ResolvedCellOwnership = CellOwnership;

export function resolveCellOwnership(cellScores: TerritoryCellScore[]): ResolvedCellOwnership[] {
  const scoresByCellPeriod = new Map<string, TerritoryCellScore[]>();

  cellScores.forEach((cellScore) => {
    const key = `${cellScore.cellId}:${cellScore.periodId}`;
    const existingScores = scoresByCellPeriod.get(key) ?? [];
    existingScores.push(cellScore);
    scoresByCellPeriod.set(key, existingScores);
  });

  return [...scoresByCellPeriod.values()].map((scoresForCell) => {
    const sortedScores = [...scoresForCell].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.groupId.localeCompare(b.groupId);
    });

    const winner = sortedScores[0];
    const runnerUp = sortedScores[1];

    return {
      cellId: winner.cellId,
      groupId: winner.groupId,
      periodId: winner.periodId,
      score: winner.score,
      runnerUpGroupId: runnerUp?.groupId,
      runnerUpScore: runnerUp?.score,
      sourceClaimIds: winner.sourceClaimIds,
      updatedAt: new Date().toISOString(),
    };
  });
}
