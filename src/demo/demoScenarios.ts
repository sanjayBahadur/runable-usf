import { CAMPUS_CONFIG, GRID_RULES, LOOP_RULES } from '@/src/constants';
import { detectClosedLoop, generateCampusGrid } from '@/src/lib/geometry';
import { applyClaimToCells, createClaimFromRun, resolveCellOwnership } from '@/src/lib/territory';
import type { CellOwnership, CellScore, ClosedLoopResult, Group, IssueReport, RunSession, Sighting } from '@/src/types';

import { demoGroups } from '@/src/demo/demoGroups';
import { demoIssues } from '@/src/demo/demoIssues';
import { demoRunSessions } from '@/src/demo/demoPaths';
import { demoSightings } from '@/src/demo/demoSightings';

export type DemoTerritoryScenario = {
  groups: Group[];
  cells: ReturnType<typeof generateCampusGrid>;
  runs: RunSession[];
  loopResults: ClosedLoopResult[];
  claims: NonNullable<ReturnType<typeof createClaimFromRun>>[];
  scores: CellScore[];
  ownership: CellOwnership[];
  issues: IssueReport[];
  sightings: Sighting[];
};

export function runDemoTerritoryScenario(): DemoTerritoryScenario {
  const groups = demoGroups;
  const cells = generateCampusGrid(CAMPUS_CONFIG.boundary, GRID_RULES.cellSizeMeters);

  const orderedRuns = demoRunSessions.slice(0, 2);
  const loopResults = orderedRuns.map((runSession) => detectClosedLoop(runSession.path, LOOP_RULES));

  const claims = orderedRuns
    .map((runSession, index) =>
      createClaimFromRun(runSession, loopResults[index], runSession.userId, runSession.groupId),
    )
    .filter((claim): claim is NonNullable<typeof claim> => claim !== null);

  let scores = [] as CellScore[];

  claims.forEach((claim) => {
    scores = applyClaimToCells(claim, cells, scores);
  });

  const ownership = resolveCellOwnership(scores);

  return {
    groups,
    cells,
    runs: orderedRuns,
    loopResults,
    claims,
    scores,
    ownership,
    issues: demoIssues,
    sightings: demoSightings,
  };
}
