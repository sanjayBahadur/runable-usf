import { Polygon } from 'react-native-maps';

import { USF_BOARD_BOUNDARY } from '@/src/constants';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { Coordinate } from '@/src/types';

type PlayableBoardLayerProps = {
  boundary?: Coordinate[];
};

function toMapCoordinate([latitude, longitude]: Coordinate) {
  return { latitude, longitude };
}

export function PlayableBoardLayer({
  boundary = USF_BOARD_BOUNDARY,
}: PlayableBoardLayerProps) {
  return (
    <Polygon
      coordinates={boundary.map(toMapCoordinate)}
      strokeColor={RUNABLE_THEME.colors.boardBorder}
      fillColor={RUNABLE_THEME.colors.boardTint}
      strokeWidth={3}
      lineDashPattern={[8, 6]}
      tappable={false}
    />
  );
}
