import { Polygon } from 'react-native-maps';

import type { Coordinate } from '@/src/types';

type CampusBoundaryLayerProps = {
  boundary: Coordinate[];
};

function toMapCoordinate([latitude, longitude]: Coordinate) {
  return { latitude, longitude };
}

export function CampusBoundaryLayer({ boundary }: CampusBoundaryLayerProps) {
  if (boundary.length < 3) {
    return null;
  }

  return (
    <Polygon
      coordinates={boundary.map(toMapCoordinate)}
      strokeColor="rgba(0, 103, 71, 0.95)"
      fillColor="rgba(0, 103, 71, 0.12)"
      strokeWidth={3}
      tappable={false}
    />
  );
}
