# Known Issues

This file tracks known limitations discovered while implementing modules.

If a later module resolves an item naturally, remove it or mark it resolved there.
If not, keep it here for explicit follow-up work.

## Open

### Module 02 — Territory Engine

- `resolveCellOwnership()` currently sets `updatedAt` using the runtime timestamp instead of deriving it from claim timing.
- Claim scoring uses a simple capped pace bonus formula for MVP and may need balancing once real run data exists.

### Module 03 — Demo Mode

- `runDemoTerritoryScenario()` currently uses the first two demo runs because Module 03 only requires Group A plus one overlapping rival claim.
- A third demo group and valid loop already exist in `src/demo`, but they are not yet included in the returned ownership scenario.
