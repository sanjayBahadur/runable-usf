import { Polygon } from 'react-native-maps';

import { SHOW_ACCESS_BOUNDARY_DEBUG, USF_ACCESS_BOUNDARY } from '@/src/constants';
import type { Coordinate } from '@/src/types';

type CampusBoundaryLayerProps = {
  boundary?: Coordinate[];
};

function toMapCoordinate([latitude, longitude]: Coordinate) {
  return { latitude, longitude };
}

export function CampusBoundaryLayer({
  boundary = USF_ACCESS_BOUNDARY,
}: CampusBoundaryLayerProps) {
  if (!SHOW_ACCESS_BOUNDARY_DEBUG || boundary.length < 3) {
    return null;
  }

  return (
    <Polygon
      coordinates={boundary.map(toMapCoordinate)}
      strokeColor="rgba(245, 158, 11, 0.65)"
      fillColor="rgba(245, 158, 11, 0.06)"
      strokeWidth={2}
      tappable={false}
    />
  );
}
