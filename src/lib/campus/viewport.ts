import {
  USF_INITIAL_REGION,
  USF_PREVIEW_REGION,
  USF_VIEWPORT_BOUNDS,
} from '@/src/constants';

export type CampusRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getInitialCampusRegion(): CampusRegion {
  return { ...USF_INITIAL_REGION };
}

export function getPreviewCampusRegion(): CampusRegion {
  return { ...USF_PREVIEW_REGION };
}

export function clampRegionToCampus(region: CampusRegion): CampusRegion {
  return {
    latitude: clamp(region.latitude, USF_VIEWPORT_BOUNDS.south, USF_VIEWPORT_BOUNDS.north),
    longitude: clamp(
      region.longitude,
      USF_VIEWPORT_BOUNDS.west,
      USF_VIEWPORT_BOUNDS.east,
    ),
    latitudeDelta: clamp(region.latitudeDelta, 0.004, USF_PREVIEW_REGION.latitudeDelta),
    longitudeDelta: clamp(region.longitudeDelta, 0.004, USF_PREVIEW_REGION.longitudeDelta),
  };
}
