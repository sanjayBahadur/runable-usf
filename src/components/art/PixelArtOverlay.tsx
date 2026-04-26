import { Polygon } from 'react-native-maps';

import type { CampusCell, CellArt } from '@/src/types';

type PixelArtOverlayProps = {
  cells: CampusCell[];
  cellArt: CellArt[];
};

function toMapCoordinate([latitude, longitude]: [number, number]) {
  return { latitude, longitude };
}

function toPaintFillColor(hexColor: string) {
  const normalized = hexColor.replace('#', '');

  if (normalized.length !== 6) {
    return 'rgba(249, 115, 22, 0.76)';
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, 0.82)`;
}

export function PixelArtOverlay({ cells, cellArt }: PixelArtOverlayProps) {
  const cellById = new Map(cells.map((cell) => [cell.id, cell]));

  return (
    <>
      {cellArt.map((entry) => {
        const cell = cellById.get(entry.cellId);

        if (!cell) {
          return null;
        }

        return (
          <Polygon
            key={`art-${entry.cellId}`}
            coordinates={cell.polygon.map(toMapCoordinate)}
            fillColor={toPaintFillColor(entry.color)}
            strokeColor={entry.color}
            strokeWidth={1}
            tappable={false}
          />
        );
      })}
    </>
  );
}
