export const LOOP_RULES = {
  minPathDistanceMeters: 100,
  minAreaSquareMeters: 400,
  minGpsPoints: 8,
  closeLoopThresholdMeters: 35,
  maxAllowedGpsAccuracyMeters: 35,
} as const;

export const GRID_RULES = {
  cellSizeMeters: 10,
} as const;
