# Runable Agent Instructions

## Project Summary

Runable is a React Native + Expo SDK 54 hackathon app.

Runable is a campus-only gamified running and stewardship app. Users run closed loops on campus to claim grid-based territory for their group. Groups compete for campus cells, paint owned cells, report and fix campus issues with photos, add sightings and landmarks, and compete on leaderboards.

The app is being built demo-first. The first goal is a working local demo, not production infrastructure.

## Final Tech Stack

- React Native + Expo SDK 54
- Expo Router
- TypeScript
- react-native-maps
- expo-location
- expo-image-picker
- Supabase later for auth, database, storage, and realtime
- Zustand for local app state
- Zod + React Hook Form for forms
- Turf.js plus custom geometry utilities
- lucide-react-native for icons

## Current Build Strategy

Build modularly and minimally.

The correct module order is:

1. Module 00 — Shared Types & Constants
2. Module 01 — Geometry Engine
3. Module 02 — Territory Engine
4. Module 03 — Demo Mode
5. Module 04 — Map Rendering
6. Module 05 — Pixel Art Layer
7. Module 06 — Issues: Reporting & Fixing
8. Module 07 — Leaderboards & Feed
9. Module 08 — Supabase & Auth Integration
10. Module 09 — Real Run Tracking
11. Module 10 — Sightings & Landmarks
12. Module 11 — Game Periods & Archives
13. Module 12 — Optional AI Photo Verification

Do not skip ahead unless explicitly instructed.

## Important Build Principle

Build the local demo first.

The first working milestone is:

- app opens
- map renders
- campus boundary appears
- demo territory cells render
- overlapping group claims work
- issue pins render
- sighting pins render

Do not prioritize auth, Supabase, realtime, final styling, or AI before the local demo works.

## Core Gameplay Rules

A user can run any path inside the campus boundary.

A valid claim loop requires:

- at least 8 GPS points
- at least 100 meters total path distance
- final point within 25 meters of the starting point
- at least 400 square meters enclosed area
- mostly inside the campus boundary

Territory rules:

- campus is divided into 10m grid cells for MVP
- do not use 1m cells in MVP
- a valid loop creates a claim polygon
- all cells whose centers fall inside the claim polygon receive score for the runner’s group
- each cell owner is the group with the highest score for the active period
- overlapping claims are resolved by score
- higher-scoring groups appear visually on top
- non-overlapped cells remain owned by their previous group
- users can paint only cells owned by their group

Stewardship rules:

- anyone can report issues
- anyone can fix issues
- open issues appear as red pins
- fixed issues appear as green pins
- fixing issues gives high points
- issue reporting/fixing must not be blocked by territory ownership

## Architecture Rules

Keep modules independent.

Geometry engine:

- pure TypeScript only
- no React imports
- no Expo imports
- no Supabase imports
- no Zustand imports
- no UI logic

Territory engine:

- pure TypeScript where possible
- no React imports
- no map rendering
- no Supabase writes
- no UI logic

Map components:

- prop-driven
- render data only
- do not calculate ownership
- do not mutate game state directly

Supabase:

- do not add Supabase until the local demo modules work
- keep Supabase code isolated in service files
- app must still work in demo mode without Supabase env vars
- do not hardcode secrets

Styling:

- keep UI minimal but clean for now
- leave room for design polish later
- do not spend time on final visual design until the core demo works

## Dependencies to Use

Allowed:

- react-native-maps
- expo-location
- expo-image-picker
- @supabase/supabase-js
- zustand
- zod
- react-hook-form
- @turf/turf
- lucide-react-native
- react-native-svg

Avoid for MVP:

- Mapbox
- MapLibre
- Firebase
- complex polygon clipping
- backend cron jobs
- AI APIs before the core demo works
- full authentication before the local demo works

## File Organization

Use this structure when possible:

```txt
src/
  types/
  constants/
  lib/
    geometry/
    territory/
    gamification/
    supabase/
    feed/
    leaderboard/
    periods/
    ai/
  components/
    map/
    territory/
    run/
    issues/
    sightings/
    art/
    feed/
    leaderboard/
    archive/
    auth/
  hooks/
  store/
  demo/
  features/
    issues/
    runs/
    sightings/
docs/
  modules/
Module Instruction Files

Each implementation task should follow the matching file in docs/modules.

Module files are the source of truth for each task.

Do not implement a module unless the user explicitly asks for that module.

When implementing a module:

read AGENTS.md
read the specific module file
implement only that module
do not touch unrelated modules unless required for imports/exports
summarize changed files
run available checks
explain how to test
Definition of Done

A module is done when:

TypeScript compiles
exports are clean
responsibilities are not mixed
app still starts with npx expo start
no unrelated modules were implemented
no unnecessary dependencies were added
implementation is minimal and easy to extend later
Default Response After Work

After implementing a module, summarize:

files created
files modified
what the module now supports
how to test it
any known limitations