export type ClaimScoreInput = {
  distanceMeters: number;
  areaSquareMeters: number;
  durationSeconds?: number;
};

const BASE_CLAIM_SCORE = 50;
const DISTANCE_MULTIPLIER = 0.05;
const AREA_MULTIPLIER = 0.01;
const MAX_PACE_BONUS = 40;
const PACE_BONUS_MULTIPLIER = 12;

export function calculateClaimScore(input: ClaimScoreInput): number {
  const safeDistanceMeters = Math.max(0, input.distanceMeters);
  const safeAreaSquareMeters = Math.max(0, input.areaSquareMeters);
  const safeDurationSeconds = Math.max(0, input.durationSeconds ?? 0);

  const paceBonus =
    safeDurationSeconds > 0
      ? Math.min(MAX_PACE_BONUS, (safeDistanceMeters / safeDurationSeconds) * PACE_BONUS_MULTIPLIER)
      : 0;

  return (
    BASE_CLAIM_SCORE +
    safeDistanceMeters * DISTANCE_MULTIPLIER +
    safeAreaSquareMeters * AREA_MULTIPLIER +
    paceBonus
  );
}
