import { useState } from 'react';

import { applyCellPaint, canPaintCell, getVisibleCellArt } from '@/src/lib/art';
import type { CellArt, CellOwnership } from '@/src/types';

const DEFAULT_COLOR = '#F97316';

type UsePixelArtOptions = {
  userGroupId: string;
  userId: string;
  ownership: CellOwnership[];
  initialArt?: CellArt[];
};

export function usePixelArt({
  userGroupId,
  userId,
  ownership,
  initialArt = [],
}: UsePixelArtOptions) {
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [cellArt, setCellArt] = useState<CellArt[]>(initialArt);

  const visibleCellArt = getVisibleCellArt(ownership, cellArt);

  function paintCell(cellId: string) {
    const cellOwnership = ownership.find((entry) => entry.cellId === cellId);

    if (!canPaintCell(userGroupId, cellOwnership)) {
      return { painted: false as const };
    }

    setCellArt((existingArt) =>
      applyCellPaint(cellId, userGroupId, selectedColor, existingArt, userId),
    );

    return { painted: true as const };
  }

  return {
    selectedColor,
    setSelectedColor,
    visibleCellArt,
    paintCell,
  };
}
