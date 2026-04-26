import { Polyline } from 'react-native-maps';

import { STATUS_COLORS } from '@/src/constants';
import type { Coordinate } from '@/src/types';

type RunPathLayerProps = {
  runPath?: Coordinate[] | Coordinate[][];
};

function toMapCoordinate([latitude, longitude]: Coordinate) {
  return { latitude, longitude };
}

function normalizeRunPaths(runPath?: Coordinate[] | Coordinate[][]): Coordinate[][] {
  if (!runPath || runPath.length === 0) {
    return [];
  }

  if (Array.isArray(runPath[0][0])) {
    return runPath as Coordinate[][];
  }

  return [runPath as Coordinate[]];
}

export function RunPathLayer({ runPath }: RunPathLayerProps) {
  const runPaths = normalizeRunPaths(runPath);

  return (
    <>
      {runPaths.map((path, index) => (
        <Polyline
          key={`run-path-${index}`}
          coordinates={path.map(toMapCoordinate)}
          strokeColor={STATUS_COLORS.route}
          strokeWidth={4}
          lineDashPattern={index === 0 ? undefined : [10, 6]}
        />
      ))}
    </>
  );
}
