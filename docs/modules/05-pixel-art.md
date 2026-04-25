# Module 05 — Pixel Art Layer

## Goal

Allow groups to paint owned campus cells.

The campus grid itself is the pixel canvas. Do not build a separate canvas system.

A group can paint only the cells it currently owns.

## Files to Create

```txt
src/components/art/PixelToolbar.tsx
src/components/art/PixelColorPicker.tsx
src/components/art/PixelArtOverlay.tsx
src/components/art/index.ts

src/hooks/usePixelArt.ts

src/lib/art/artRules.ts
src/lib/art/index.ts
Required Types

Use or extend CellArt from Module 00.

Each painted cell should store:

cellId
groupId
color
updatedByUserId
updatedAt
Required Functions
canPaintCell(userGroupId, cellOwnership)
applyCellPaint(cellId, groupId, color, existingArt)
getVisibleCellArt(cellOwnership, cellArt)
Required UI

Create:

PixelColorPicker
PixelToolbar
PixelArtOverlay

MVP interaction:

1. user selects color
2. user taps owned cell
3. cell receives art color
4. painted color appears on map
Rules
Do not create a complex drawing canvas.
Do not create 16x16 territory canvases.
Use cell-based painting only.
Do not allow painting cells owned by other groups.
Do not connect Supabase yet.
Store art locally or in demo state for now.
Keep UI minimal.
Acceptance Criteria
User can select a color.
User can paint owned cells.
User cannot paint rival-owned cells.
Painted cells appear visually on the map.
Art logic is separate from map rendering.
App still runs.



#Codex Prompt

Implement Module 05 only.

Follow docs/modules/05-pixel-art.md.

Use existing territory ownership data.

Do not implement Supabase, auth, issue reporting, feed, or final styling.

After implementation:

summarize files created/changed
run available TypeScript/lint checks
explain how to test painting owned cells