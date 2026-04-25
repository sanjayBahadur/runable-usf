# Module 03 — Demo Mode

## Goal

Create a demo mode that proves the core game works indoors without relying on live GPS.

Demo Mode should simulate:

```txt
- groups
- campus paths
- valid closed-loop claims
- overlapping rival claims
- issue pins
- sighting pins
- territory ownership

This is mandatory for hackathon reliability.

Files to Create
src/demo/demoGroups.ts
src/demo/demoPaths.ts
src/demo/demoIssues.ts
src/demo/demoSightings.ts
src/demo/demoScenarios.ts
src/demo/index.ts
Required Demo Data

Create:

3 mock groups
2 valid demo loop paths near the USF campus area
1 overlapping rival loop path
2 open issues
1 fixed issue
2 sightings
Required Function
runDemoTerritoryScenario()

This function should:

1. load demo groups
2. generate campus grid from the campus boundary
3. apply Group A claim
4. apply Group B overlapping claim
5. resolve ownership
6. return groups, cells, claims, scores, ownership, issues, and sightings
Rules
Do not use live GPS.
Do not connect Supabase.
Do not build UI yet.
Use Modules 00, 01, and 02.
Demo paths must satisfy closed-loop rules.
Demo paths should be small enough to render quickly.
Keep demo data realistic but simple.
Acceptance Criteria
runDemoTerritoryScenario() returns usable map data.
Group A owns some cells.
Group B overlaps and wins some cells.
Group A keeps non-overlapped cells.
Issues and sightings are included in returned data.
No React imports required.




#Codex Prompt

Implement Module 03 only.

Follow docs/modules/03-demo-mode.md.

Use Modules 00, 01, and 02.

Do not implement map rendering, real GPS, Supabase, auth, pixel art, issue forms, feed, or leaderboards.

After implementation:

summarize files created
run available TypeScript/lint checks
explain what runDemoTerritoryScenario() returns