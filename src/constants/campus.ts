import type { Coordinate } from '@/src/types';

export const USF_CAMPUS_NAME = 'USF Tampa';

export const USF_MAP_CENTER: Coordinate = [28.0618, -82.4139];

/**
 * USF Tampa campus boundary — 4-corner rectangle matching the
 * actual road boundaries provided by the user.
 *
 *   NW: 28.0690841, -82.4258897
 *   NE: 28.0690826, -82.4019691
 *   SE: 28.0546170, -82.4019674
 *   SW: 28.054730,  -82.425872
 */
export const USF_BOARD_BOUNDARY: Coordinate[] = [
  [28.0690841, -82.4258897], // NW
  [28.0690826, -82.4019691], // NE
  [28.0546170, -82.4019674], // SE
  [28.0547300, -82.4258720], // SW
  [28.0690841, -82.4258897], // close
];

export const USF_BOARD_BOUNDS = {
  north: 28.0691,
  south: 28.0546,
  west: -82.4259,
  east: -82.4020,
} as const;

/**
 * Access boundary with a ~50 m buffer so users right at the campus
 * edge still register as "on campus".
 */
export const USF_ACCESS_BOUNDARY: Coordinate[] = [
  [28.0696, -82.4264], // NW + buffer
  [28.0696, -82.4014], // NE + buffer
  [28.0541, -82.4014], // SE + buffer
  [28.0542, -82.4264], // SW + buffer
  [28.0696, -82.4264], // close
];

export const USF_BOARD_REGION = {
  latitude: 28.0618,
  longitude: -82.4139,
  latitudeDelta: 0.017,
  longitudeDelta: 0.026,
} as const;

export const USF_CAMERA_PADDING = {
  top: 48,
  right: 24,
  bottom: 160,
  left: 24,
} as const;

export const USF_INITIAL_REGION = USF_BOARD_REGION;

export const USF_PREVIEW_REGION = {
  latitude: USF_BOARD_REGION.latitude,
  longitude: USF_BOARD_REGION.longitude,
  latitudeDelta: 0.019,
  longitudeDelta: 0.028,
} as const;

/**
 * Viewport bounds are a simple rectangle used only for camera clamping.
 * Slightly larger than the board to allow comfortable panning.
 */
export const USF_VIEWPORT_BOUNDS = {
  north: 28.0710,
  south: 28.0520,
  west: -82.4280,
  east: -82.3990,
} as const;

export const USF_GAMEPLAY_BOUNDARY = USF_BOARD_BOUNDARY;
export const USF_CAMPUS_BOUNDARY = USF_ACCESS_BOUNDARY;
export const CAMPUS_CENTER = USF_MAP_CENTER;
export const SHOW_ACCESS_BOUNDARY_DEBUG = false;

export const CAMPUS_CONFIG = {
  name: 'University of South Florida',
  shortName: 'USF',
  campusName: USF_CAMPUS_NAME,
  center: USF_MAP_CENTER,
  boundary: USF_ACCESS_BOUNDARY,
  accessBoundary: USF_ACCESS_BOUNDARY,
  boardBoundary: USF_BOARD_BOUNDARY,
  boardBounds: USF_BOARD_BOUNDS,
  boardRegion: USF_BOARD_REGION,
  initialRegion: USF_INITIAL_REGION,
  previewRegion: USF_PREVIEW_REGION,
  viewportBounds: USF_VIEWPORT_BOUNDS,
} as const;
