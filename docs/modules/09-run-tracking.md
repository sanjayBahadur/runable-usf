# Module 09 — Real Run Tracking

## Goal

Add real GPS-based run tracking using Expo Location.

This module should be added after the demo territory flow works.

Users should be able to:

```txt
start a run
record GPS points
see elapsed time
see distance
finish the run
send the path to the claim flow
Files to Create
src/hooks/useLocationPermission.ts
src/hooks/useRunTracker.ts

src/components/run/RunControls.tsx
src/components/run/RunStatsPanel.tsx
src/components/run/ActiveRunOverlay.tsx
src/components/run/RunSummaryCard.tsx
src/components/run/index.ts

src/features/runs/completeRunClaim.ts
src/features/runs/index.ts
Required Behavior
1. request location permission
2. start watching location
3. append GPS points to path
4. calculate total distance
5. calculate elapsed time
6. allow pause/resume
7. finish run
8. call closed-loop detection
9. show valid or invalid result
Required Hook Contract
const {
  status,
  path,
  distanceMeters,
  elapsedSeconds,
  currentLocation,
  startRun,
  pauseRun,
  resumeRun,
  finishRun,
  cancelRun,
} = useRunTracker();
Rules
Use Expo Location.
Do not remove demo mode.
Do not connect directly to Supabase inside the hook.
The hook records path only.
Claim logic should happen in completeRunClaim.ts.
Keep UI minimal.
Handle permission denial gracefully.
Acceptance Criteria
Location permission prompt works.
User can start/finish a run.
Path appears on map.
Distance and elapsed time update.
Finished path can be checked by geometry engine.
Invalid loop shows clear reason.
Valid loop can create territory claim.







#Codex Prompt

Implement Module 09 only.

Follow docs/modules/09-run-tracking.md.

Use existing geometry and territory engines.

Do not break demo mode.
Do not add Supabase writes yet unless service functions already exist.

After implementation:

summarize files created/changed
run available TypeScript/lint checks
explain how to test a real run and how to test demo mode
