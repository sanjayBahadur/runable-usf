import { Polygon } from 'react-native-maps';

import type { CampusCell, CellOwnership, Group } from '@/src/types';

type TerritoryCellLayerProps = {
  cells: CampusCell[];
  ownership: CellOwnership[];
  groups: Group[];
  onCellPress?: (cellId: string) => void;
};

function toMapCoordinate([latitude, longitude]: [number, number]) {
  return { latitude, longitude };
}

function toCellFillColor(hexColor: string) {
  const normalized = hexColor.replace('#', '');
  if (normalized.length !== 6) {
    return 'rgba(51, 65, 85, 0.32)';
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, 0.34)`;
}

export function TerritoryCellLayer({
  cells,
  ownership,
  groups,
  onCellPress,
}: TerritoryCellLayerProps) {
  const ownershipByCellId = new Map(ownership.map((entry) => [entry.cellId, entry]));
  const groupColorsById = new Map(groups.map((group) => [group.id, group.primaryColor]));

  return (
    <>
      {cells.map((cell) => {
        const cellOwnership = ownershipByCellId.get(cell.id);

        if (!cellOwnership) {
          return null;
        }

        const groupColor = groupColorsById.get(cellOwnership.groupId) ?? '#334155';

        return (
          <Polygon
            key={cell.id}
            coordinates={cell.polygon.map(toMapCoordinate)}
            fillColor={toCellFillColor(groupColor)}
            strokeColor={groupColor}
            strokeWidth={0.5}
            tappable={Boolean(onCellPress)}
            onPress={() => onCellPress?.(cell.id)}
          />
        );
      })}
    </>
  );
}
