import { LOOP_RULES, POINTS } from '@/src/constants';
import { detectClosedLoop } from '@/src/lib/geometry';
import { applyClaimToCells, createClaimFromRun, resolveCellOwnership } from '@/src/lib/territory';
import type { CampusCell, CellOwnership, CellScore, ClosedLoopResult, RunSession } from '@/src/types';

type CompleteRunClaimInput = {
  runSession: RunSession;
  cells: CampusCell[];
  existingScores: CellScore[];
  userId: string;
  groupId: string;
};

export type CompleteRunClaimResult = {
  runSession: RunSession;
  loopResult: ClosedLoopResult;
  invalidReasons: string[];
  claimCreated: boolean;
  claimedCellCount: number;
  pointsAwarded: number;
  updatedScores: CellScore[];
  updatedOwnership: CellOwnership[];
};

function getInvalidReasons(loopResult: ClosedLoopResult): string[] {
  const reasons: string[] = [];

  if (loopResult.pointCount < LOOP_RULES.minGpsPoints) {
    reasons.push(`Need at least ${LOOP_RULES.minGpsPoints} GPS points.`);
  }
  if (loopResult.totalDistanceMeters < LOOP_RULES.minPathDistanceMeters) {
    reasons.push(`Need at least ${LOOP_RULES.minPathDistanceMeters} meters of path distance.`);
  }
  if (loopResult.enclosedAreaSquareMeters < LOOP_RULES.minAreaSquareMeters) {
    reasons.push(`Need at least ${LOOP_RULES.minAreaSquareMeters} m² enclosed area.`);
  }
  if (!loopResult.isClosed) {
    reasons.push(`Finish within ${LOOP_RULES.closeLoopThresholdMeters} meters of the start.`);
  }

  return reasons;
}

export function completeRunClaim({
  runSession,
  cells,
  existingScores,
  userId,
  groupId,
}: CompleteRunClaimInput): CompleteRunClaimResult {
  const loopResult = detectClosedLoop(runSession.path, LOOP_RULES);
  const invalidReasons = getInvalidReasons(loopResult);
  const completedRun: RunSession = {
    ...runSession,
    distanceMeters: loopResult.totalDistanceMeters || runSession.distanceMeters,
    status: loopResult.passesRules ? 'completed' : 'invalid',
    loopResult,
  };

  const claim = createClaimFromRun(completedRun, loopResult, userId, groupId);

  if (!claim) {
    return {
      runSession: completedRun,
      loopResult,
      invalidReasons,
      claimCreated: false,
      claimedCellCount: 0,
      pointsAwarded: 0,
      updatedScores: existingScores,
      updatedOwnership: resolveCellOwnership(existingScores),
    };
  }

  const updatedScores = applyClaimToCells(claim, cells, existingScores);
  const updatedOwnership = resolveCellOwnership(updatedScores);
  return {
    runSession: completedRun,
    loopResult,
    invalidReasons,
    claimCreated: true,
    claimedCellCount: updatedScores.filter((entry) => entry.sourceClaimIds.includes(claim.id)).length,
    pointsAwarded:
      Math.round((loopResult.totalDistanceMeters / 100) * POINTS.runPer100Meters) +
      POINTS.validLoopBonus,
    updatedScores,
    updatedOwnership,
  };
}
