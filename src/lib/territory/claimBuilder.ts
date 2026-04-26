import type { ClaimPolygon, ClosedLoopResult, Coordinate, RunSession } from '@/src/types';

import { calculateClaimScore } from '@/src/lib/territory/claimScore';
import { getActiveGamePeriod } from '@/src/lib/territory/periods';

export type TerritoryClaim = ClaimPolygon & {
  periodId: string;
  periodName: string;
  score: number;
  distanceMeters: number;
  durationSeconds: number;
};

function ensureClosedBoundary(path: Coordinate[]): Coordinate[] {
  if (path.length === 0) {
    return [];
  }

  const firstPoint = path[0];
  const lastPoint = path[path.length - 1];

  if (firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1]) {
    return path;
  }

  return [...path, firstPoint];
}

function getDurationSeconds(runSession: RunSession): number {
  if (!runSession.endedAt) {
    return 0;
  }

  const durationMs = new Date(runSession.endedAt).getTime() - new Date(runSession.startedAt).getTime();

  return durationMs > 0 ? durationMs / 1000 : 0;
}

export function createClaimFromRun(
  runSession: RunSession,
  loopResult: ClosedLoopResult,
  userId: string,
  groupId: string,
): TerritoryClaim | null {
  if (!loopResult.passesRules || runSession.path.length < 3) {
    return null;
  }

  const boundary = ensureClosedBoundary(runSession.path.map((point) => point.coordinate));
  const createdAt = runSession.endedAt ?? runSession.startedAt;
  const period = getActiveGamePeriod(new Date(createdAt));
  const durationSeconds = getDurationSeconds(runSession);
  const distanceMeters = loopResult.totalDistanceMeters || runSession.distanceMeters;

  return {
    id: `claim-${runSession.id}`,
    runSessionId: runSession.id,
    userId,
    groupId,
    boundary,
    areaSquareMeters: loopResult.enclosedAreaSquareMeters,
    createdAt,
    periodId: period.id,
    periodName: period.name,
    score: calculateClaimScore({
      distanceMeters,
      areaSquareMeters: loopResult.enclosedAreaSquareMeters,
      durationSeconds,
    }),
    distanceMeters,
    durationSeconds,
  };
}
