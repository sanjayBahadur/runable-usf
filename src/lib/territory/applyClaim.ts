import type { CampusCell, CellScore } from '@/src/types';

import { getCellsInsidePolygon } from '@/src/lib/geometry';
import type { TerritoryClaim } from '@/src/lib/territory/claimBuilder';

export type TerritoryCellScore = CellScore & {
  periodId: string;
};

export function applyClaimToCells(
  claim: TerritoryClaim,
  cells: CampusCell[],
  existingCellScores: TerritoryCellScore[],
): TerritoryCellScore[] {
  const claimedCells = getCellsInsidePolygon(cells, claim.boundary);

  if (claimedCells.length === 0) {
    return existingCellScores;
  }

  const scoreMap = new Map<string, TerritoryCellScore>(
    existingCellScores.map((cellScore) => [
      `${cellScore.cellId}:${cellScore.groupId}:${cellScore.periodId}`,
      { ...cellScore, sourceClaimIds: [...cellScore.sourceClaimIds] },
    ]),
  );

  claimedCells.forEach((cell) => {
    const key = `${cell.id}:${claim.groupId}:${claim.periodId}`;
    const existingScore = scoreMap.get(key);

    if (existingScore) {
      const sourceClaimIds = existingScore.sourceClaimIds.includes(claim.id)
        ? existingScore.sourceClaimIds
        : [...existingScore.sourceClaimIds, claim.id];

      scoreMap.set(key, {
        ...existingScore,
        score: existingScore.score + claim.score,
        sourceClaimIds,
      });

      return;
    }

    scoreMap.set(key, {
      cellId: cell.id,
      groupId: claim.groupId,
      periodId: claim.periodId,
      score: claim.score,
      sourceClaimIds: [claim.id],
    });
  });

  return [...scoreMap.values()];
}
