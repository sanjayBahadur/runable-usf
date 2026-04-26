import { useEffect, useState } from 'react';

import { applyCellPaint, canCustomizeCell, getVisibleCellArt } from '@/src/lib/art';
import { saveCellArt } from '@/src/lib/supabase';
import type { CellArt, CellOwnership } from '@/src/types';

const DEFAULT_COLOR = '#F97316';

type UsePixelArtOptions = {
  userGroupId?: string;
  userGroupRole?: 'member' | 'executive';
  userId: string;
  ownership: CellOwnership[];
  initialArt?: CellArt[];
};

export function usePixelArt({
  userGroupId,
  userGroupRole,
  userId,
  ownership,
  initialArt = [],
}: UsePixelArtOptions) {
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [cellArt, setCellArt] = useState<CellArt[]>(initialArt);

  useEffect(() => {
    setCellArt(initialArt);
  }, [initialArt]);

  const visibleCellArt = getVisibleCellArt(ownership, cellArt);

  function paintCell(cellId: string) {
    const cellOwnership = ownership.find((entry) => entry.cellId === cellId);

    if (
      !canCustomizeCell({
        userId,
        userGroupId,
        userGroupRole,
        ownership: cellOwnership,
      })
    ) {
      return { painted: false as const };
    }

    setCellArt((existingArt) =>
      applyCellPaint(cellId, userGroupId ?? userId, selectedColor, existingArt, userId),
    );
    const ownerId = userGroupId ?? userId;
    void saveCellArt({
      cell_id: cellId,
      group_id: ownerId,
      color: selectedColor,
      updated_by_user_id: userId,
    });

    return { painted: true as const };
  }

  return {
    selectedColor,
    setSelectedColor,
    visibleCellArt,
    paintCell,
  };
}
