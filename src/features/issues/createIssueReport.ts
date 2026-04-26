import { POINTS } from '@/src/constants';
import type { Coordinate, IssueCategory, IssueReport, PhotoVerificationResult } from '@/src/types';

export type CreateIssueReportInput = {
  title: string;
  category: IssueCategory;
  description?: string;
  coordinate: Coordinate;
  reportedByUserId: string;
  photoUri?: string;
  photoVerification?: PhotoVerificationResult;
};

export function createIssueReport(input: CreateIssueReportInput): {
  issue: IssueReport;
  pointsAwarded: number;
} {
  const issue: IssueReport = {
    id: `issue-${Date.now()}`,
    title: input.title,
    category: input.category,
    description: input.description,
    coordinate: input.coordinate,
    status: 'open',
    reportedByUserId: input.reportedByUserId,
    photoUri: input.photoUri ?? 'demo://issue-before-new',
    photoVerification: input.photoVerification,
    createdAt: new Date().toISOString(),
  };

  return {
    issue,
    pointsAwarded: POINTS.issueReported,
  };
}
