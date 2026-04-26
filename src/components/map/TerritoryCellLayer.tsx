import { Polygon } from 'react-native-maps';

import type { CampusCell, CellOwnership, Group } from '@/src/types';

type TerritoryCellLayerProps = {
  cells: CampusCell[];
  ownership: CellOwnership[];
  groups: Group[];
  simulatorActive?: boolean;
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
  simulatorActive,
  onCellPress,
}: TerritoryCellLayerProps) {
  const ownershipByCellId = new Map(ownership.map((entry) => [entry.cellId, entry]));
  const groupColorsById = new Map(groups.map((group) => [group.id, group.primaryColor]));

  return (
    <>
      {cells.map((cell) => {
        const cellOwnership = ownershipByCellId.get(cell.id);

        if (!cellOwnership && !simulatorActive) {
          return null;
        }

        let groupColor = '#334155'; // default/unowned color
        if (cellOwnership) {
          groupColor = groupColorsById.get(cellOwnership.groupId) ?? '#334155';
        }

        // In simulator mode, unowned cells should be faintly visible to draw the route accurately.
        const fillColor = cellOwnership ? toCellFillColor(groupColor) : 'rgba(0, 0, 0, 0.08)';
        const strokeColor = cellOwnership ? groupColor : 'rgba(0, 0, 0, 0.3)';

        return (
          <Polygon
            key={cell.id}
            coordinates={cell.polygon.map(toMapCoordinate)}
            fillColor={fillColor}
            strokeColor={strokeColor}
            strokeWidth={0.5}
            tappable={Boolean(onCellPress)}
            onPress={() => onCellPress?.(cell.id)}
          />
        );
      })}
    </>
  );
}
