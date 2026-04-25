# Module 11 — Game Periods & Archives

## Goal

Add quarter-day periods and historical winner archives.

Runable should support:

```txt
Dawn winner
Day winner
Dusk winner
Night winner
Daily winner
Weekly winner
Archived winning maps

For MVP, finalization can be manual.

Files to Create
src/lib/periods/activePeriod.ts
src/lib/periods/finalizePeriod.ts
src/lib/periods/archiveSnapshot.ts
src/lib/periods/index.ts

src/components/archive/ArchiveCard.tsx
src/components/archive/ArchivedMapPreview.tsx
src/components/archive/WinnerBanner.tsx
src/components/archive/index.ts
Period Definitions
Dawn: 5 AM – 11 AM
Day: 11 AM – 5 PM
Dusk: 5 PM – 11 PM
Night: 11 PM – 5 AM
Required Behavior
1. determine active period
2. calculate winner for a period
3. calculate daily winner
4. calculate weekly winner
5. create archive snapshot from ownership/art/points
6. display archive cards
Manual MVP Controls

For hackathon demo, allow manual finalization:

Finalize Current Period
Finalize Day
Finalize Week

These can be hidden later.

Rules
Do not build cron jobs.
Do not require backend scheduled functions.
Do not break current ownership logic.
Archive should use snapshots, not live data references.
Keep UI minimal.
Acceptance Criteria
Active period is calculated correctly.
Winner can be determined from current scores.
Archive snapshot can be created.
Archive card shows winner name, score, cells owned, issues fixed, and sightings.
App still runs.




#Codex Prompt

Implement Module 11 only.

Follow docs/modules/11-periods-archives.md.

Use existing territory and leaderboard data.

Do not implement cron jobs, Supabase scheduled functions, or final styling.

After implementation:

summarize files created/changed
run available TypeScript/lint checks
explain how to manually create an archive snapshot
