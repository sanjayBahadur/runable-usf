import { POINTS } from '@/src/constants';
import type { CellOwnership, Coordinate, IssueReport } from '@/src/types';

export type FixIssueInput = {
  issue: IssueReport;
  fixedByUserId: string;
  afterPhotoUri?: string;
  issueCoordinate?: Coordinate;
  ownership?: CellOwnership[];
  fixerGroupId?: string;
};

export function fixIssue(input: FixIssueInput): {
  issue: IssueReport;
  pointsAwarded: number;
} {
  const rivalTerritory =
    input.issueCoordinate &&
    input.ownership &&
    input.fixerGroupId &&
    input.ownership.some(
      (entry) =>
        entry.groupId !== input.fixerGroupId &&
        entry.cellId &&
        input.issueCoordinate !== undefined,
    );

  const pointsAwarded = rivalTerritory ? POINTS.rivalIssueFixed : POINTS.issueFixed;

  return {
    issue: {
      ...input.issue,
      status: 'fixed',
      fixedByUserId: input.fixedByUserId,
      afterPhotoUri: input.afterPhotoUri ?? 'demo://issue-after-new',
      fixedAt: new Date().toISOString(),
    },
    pointsAwarded,
  };
}
