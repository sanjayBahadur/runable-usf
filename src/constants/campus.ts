import type { Coordinate } from '@/src/types';

export const USF_CAMPUS_NAME = 'USF Tampa';

export const USF_MAP_CENTER: Coordinate = [28.0614, -82.4155];

export const USF_BOARD_BOUNDS = {
  north: 28.069,
  south: 28.0538,
  west: -82.4256,
  east: -82.4054,
} as const;

export const USF_BOARD_BOUNDARY: Coordinate[] = [
  [28.069, -82.4256],
  [28.069, -82.4054],
  [28.0538, -82.4054],
  [28.0538, -82.4256],
  [28.069, -82.4256],
];

export const USF_BOARD_REGION = {
  latitude: 28.0614,
  longitude: -82.4155,
  latitudeDelta: 0.018,
  longitudeDelta: 0.022,
} as const;

export const USF_CAMERA_PADDING = {
  top: 48,
  right: 24,
  bottom: 160,
  left: 24,
} as const;

export const USF_ACCESS_BOUNDARY: Coordinate[] = [
  ...USF_BOARD_BOUNDARY,
];

export const USF_INITIAL_REGION = USF_BOARD_REGION;

export const USF_PREVIEW_REGION = {
  latitude: USF_BOARD_REGION.latitude,
  longitude: USF_BOARD_REGION.longitude,
  latitudeDelta: 0.0185,
  longitudeDelta: 0.0225,
} as const;

export const USF_VIEWPORT_BOUNDS = {
  north: 28.0702,
  south: 28.0526,
  west: -82.4272,
  east: -82.4038,
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
