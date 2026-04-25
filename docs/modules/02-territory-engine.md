# Module 02 — Territory Engine

## Goal

Create the territory claim engine.

This module converts valid closed-loop runs into scored campus cells. Each cell belongs to the group with the highest score during the active game period.

This creates the Photoshop-style overlap system:
higher score appears on top, while non-overlapped cells remain owned by previous groups.

## Files to Create

```txt
src/lib/territory/claimScore.ts
src/lib/territory/claimBuilder.ts
src/lib/territory/applyClaim.ts
src/lib/territory/ownership.ts
src/lib/territory/periods.ts
src/lib/territory/index.ts
Required Functions
getActiveGamePeriod(date)
calculateClaimScore(input)
createClaimFromRun(runSession, loopResult, userId, groupId)
applyClaimToCells(claim, cells, existingCellScores)
resolveCellOwnership(cellScores)
Game Periods

Use four daily periods:

Dawn: 5 AM – 11 AM
Day: 11 AM – 5 PM
Dusk: 5 PM – 11 PM
Night: 11 PM – 5 AM
Claim Score

Use a simple MVP formula:

score =
  50
  + distanceMeters * 0.05
  + areaSquareMeters * 0.01
  + cappedPaceBonus

Pace bonus should be capped to avoid scooter cheating.

Cell Ownership Rule

Each cell can have scores from multiple groups.

The owner is:

group with highest score for the active period

If Group A claims 50 cells, then Group B overlaps 20 cells and scores higher:

Group B owns the overlapped 20 cells
Group A keeps the non-overlapped 30 cells
Rules
Keep logic pure where possible.
No React.
No UI.
No Supabase.
No map rendering.
No pixel art.
No issues/feed/leaderboards.
Use Module 00 types/constants.
Use Module 01 geometry outputs.
Preserve runner-up group info if possible.
Acceptance Criteria
Claim score can be calculated.
A claim can be created from a valid run.
Claim applies score to cells inside the polygon.
Cell ownership resolves by highest group score.
Overlapping claims work correctly.
Non-overlapped cells remain owned by previous group.
Exports are clean from src/lib/territory/index.ts.







#Codex Prompt

Implement Module 02 only.

Follow docs/modules/02-territory-engine.md.

Use Modules 00 and 01.

Do not implement map rendering, demo mode, pixel art, issues, sightings, feed, Supabase, auth, or leaderboards.

After implementation:

summarize files created
run available TypeScript/lint checks
explain how overlapping group claims are resolved