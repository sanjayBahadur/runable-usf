# Module 01 — Geometry Engine

## Goal

Create pure TypeScript geometry utilities for Runable.

This module handles distance calculation, closed-loop detection, polygon area, campus boundary checks, grid generation, and selecting cells inside a polygon.

This is the math heart of the app. Keep it pure.

## Files to Create

```txt
src/lib/geometry/haversine.ts
src/lib/geometry/pathDistance.ts
src/lib/geometry/closedLoop.ts
src/lib/geometry/polygonArea.ts
src/lib/geometry/pointInPolygon.ts
src/lib/geometry/campusBoundary.ts
src/lib/geometry/grid.ts
src/lib/geometry/cellSelection.ts
src/lib/geometry/index.ts
Required Functions
calculateDistanceMeters(a, b)
calculatePathDistanceMeters(path)
calculatePolygonAreaSquareMeters(polygon)
isPointInsidePolygon(point, polygon)
isPathInsideCampus(path, campusBoundary)
detectClosedLoop(path, rules)
generateCampusGrid(campusBoundary, cellSizeMeters)
getCellsInsidePolygon(cells, polygon)
Expected Behavior
calculateDistanceMeters

Uses the Haversine formula to calculate distance between two coordinates in meters.

calculatePathDistanceMeters

Adds up the distance between all consecutive GPS points in a path.

calculatePolygonAreaSquareMeters

Approximates polygon area in square meters.

MVP approximation is acceptable.

isPointInsidePolygon

Returns true if a coordinate is inside a polygon.

isPathInsideCampus

Returns true if most or all points in a path are inside the campus boundary.

detectClosedLoop

A loop is valid if:

- path has at least 8 points
- total path distance is at least 100 meters
- final point is within 25 meters of start point
- enclosed area is at least 400 square meters

Return a ClosedLoopResult.

generateCampusGrid

Generates 10m campus cells inside or around the campus boundary.

Each cell should have:

id
center coordinate
polygon coordinates
getCellsInsidePolygon

Returns cells whose center point is inside a claim polygon.

Rules
Pure functions only.
No React.
No UI.
No Supabase.
No Zustand.
No Expo Location.
No map rendering.
Use types/constants from Module 00.
Keep functions unit-testable.
Approximate geometry is okay for MVP.
Use 10m grid cells, not 1m cells.
Acceptance Criteria
Functions export from src/lib/geometry/index.ts.
A valid demo loop can be detected.
A short invalid path is rejected.
A non-closed path is rejected.
Grid cells can be generated from the campus boundary.
Cells inside a polygon can be selected.
No React imports.
No Supabase imports.






# Codex Prompt

Implement Module 01 only.

Follow docs/modules/01-geometry-engine.md.

Use Module 00 types and constants.

Do not implement territory scoring, map rendering, run tracking, Supabase, auth, pixel art, issues, sightings, feed, or leaderboards.

After implementation:

summarize files created
run available TypeScript/lint checks
provide a tiny example of calling detectClosedLoop