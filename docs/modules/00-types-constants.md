# Module 00 — Shared Types & Constants

## Goal

Create the shared TypeScript types and constants used across Runable.

This module defines the vocabulary of the app: users, groups, runs, territories, cells, issues, sightings, feed items, art, leaderboards, periods, and core game rules.

## Files to Create

```txt
src/types/common.ts
src/types/user.ts
src/types/group.ts
src/types/run.ts
src/types/territory.ts
src/types/issue.ts
src/types/sighting.ts
src/types/feed.ts
src/types/art.ts
src/types/leaderboard.ts
src/types/period.ts
src/types/index.ts

src/constants/campus.ts
src/constants/gameRules.ts
src/constants/points.ts
src/constants/colors.ts
src/constants/index.ts
Required Types

Create reusable types for:

Coordinate
UserProfile
Group
RunSession
ClosedLoopResult
CampusCell
ClaimPolygon
CellScore
CellOwnership
IssueReport
Sighting
FeedItem
CellArt
LeaderboardEntry
GamePeriod

Use this coordinate convention:

export type Coordinate = [number, number];
// [latitude, longitude]
Required Constants

Create loop rules:

export const LOOP_RULES = {
  minPathDistanceMeters: 100,
  minAreaSquareMeters: 400,
  minGpsPoints: 8,
  closeLoopThresholdMeters: 25,
  maxAllowedGpsAccuracyMeters: 35,
};

Create grid rules:

export const GRID_RULES = {
  cellSizeMeters: 10,
};

Create point values:

export const POINTS = {
  runPer100Meters: 5,
  validLoopBonus: 50,
  issueReported: 20,
  issueFixed: 150,
  rivalIssueFixed: 200,
  sightingAdded: 25,
  pixelPainted: 10,
  territoryDefended: 75,
  territoryStolen: 125,
};

Create a placeholder USF campus boundary polygon in src/constants/campus.ts.

The boundary can be approximate for now. It will be refined later.

Rules
Do not build UI.
Do not connect Supabase.
Do not implement geometry functions.
Do not implement run tracking.
Do not add dependencies.
Keep types simple and reusable.
Export all types from src/types/index.ts.
Export all constants from src/constants/index.ts.
Acceptance Criteria
All files are created.
TypeScript compiles.
Types can be imported from src/types.
Constants can be imported from src/constants.
No React imports.
No Supabase imports.
No geometry logic yet.






# Codex Prompt

Implement Module 00 only.

Follow docs/modules/00-types-constants.md.

Do not implement geometry, UI, Supabase, auth, map rendering, run tracking, demo mode, issue reporting, or pixel art.

After implementation:

summarize files created
run available TypeScript/lint checks
explain how this module can be tested