# Module 13 — Campus Access & Viewport UX

## Goal

Turn Runable from a generic map app into a campus-exclusive game board.

The app should open directly into a focused USF Tampa campus viewport. The map should feel like a bounded campus world, not a generic global map.

This module defines:

- USF campus viewport behavior
- campus-only gameplay gating
- off-campus preview mode
- map camera constraints
- campus status messaging

## Design Direction

Runable is a campus-first experience.

The map is not just a map. It is the game board.

Users should immediately feel:

> I am inside the USF Runable zone.

## Files to Create or Update

```txt
src/constants/campus.ts

src/lib/campus/campusAccess.ts
src/lib/campus/viewport.ts
src/lib/campus/index.ts

src/components/campus/CampusStatusChip.tsx
src/components/campus/OffCampusBanner.tsx
src/components/campus/CampusGateOverlay.tsx
src/components/campus/index.ts

src/components/map/CampusMap.tsx
Required Constants

Update src/constants/campus.ts with:

USF_CAMPUS_NAME
USF_MAP_CENTER
USF_INITIAL_REGION
USF_VIEWPORT_BOUNDS
USF_GAMEPLAY_BOUNDARY
USF_PREVIEW_REGION

Important distinction:

USF_VIEWPORT_BOUNDS controls what the map camera focuses on.
USF_GAMEPLAY_BOUNDARY controls where gameplay is valid.

The viewport can be a clean square/rectangle.

The gameplay boundary can be a polygon or approximate campus box.

Required Functions

Create:

isUserInsideCampus(userLocation, campusBoundary)
getCampusAccessState(userLocation)
getInitialCampusRegion()
clampRegionToCampus(region)
getOffCampusMessage(accessState)
Access States

Use:

type CampusAccessState =
  | "unknown"
  | "onCampus"
  | "nearCampus"
  | "offCampus";
UX Rules

If user is on campus:

live run tracking is enabled
territory claiming is enabled
issue reporting is enabled
sighting creation is enabled
painting owned cells is enabled

If user is off campus:

app still opens
map still works
feed/stats/group still work
demo mode still works
live claiming is disabled
show an off-campus banner or chip

Do not fully block the app when off campus.

Map Behavior

The map should initially open centered on USF Tampa.

Use USF_INITIAL_REGION.

For MVP:

do not allow the map to start zoomed out to the whole city
keep the experience campus-focused
if the user pans away, provide a recenter button
optionally soft-clamp the region back toward campus

Do not implement complicated gesture systems yet.

UI Components
CampusStatusChip

Small chip showing:

USF Campus Mode
On Campus / Preview Mode
OffCampusBanner

User-facing message:

You are outside the USF play zone. You can explore the map and use demo mode, but live claims only activate on campus.
CampusGateOverlay

Optional overlay used when user tries to start a live claim off campus.

Rules
Do not break demo mode.
Do not block the whole app off campus.
Do not remove current map rendering.
Do not implement final animations yet.
Do not implement Supabase.
Keep UI minimal but clean.
Use shared campus constants instead of hardcoding coordinates in components.
Acceptance Criteria
App opens centered on USF.
Campus boundary/viewport feels intentional.
User can see whether they are on campus or in preview mode.
Off-campus users can still explore and use demo mode.
Live claim actions can be disabled off campus.
Map has a recenter-to-campus action.
No unrelated modules are rewritten.
Codex Prompt

Implement Module 13 only.

Read AGENTS.md and docs/modules/13-campus-access-viewport-ux.md.

Do not implement design system, motion polish, Supabase, auth, or new gameplay logic.

Focus only on campus viewport, campus access state, and UI indicators for on-campus vs off-campus behavior.

After implementation:

summarize files created
summarize files modified
explain how to test on-campus/preview behavior
run available TypeScript/lint checks



























