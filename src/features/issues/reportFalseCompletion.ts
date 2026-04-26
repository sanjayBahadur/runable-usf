import { verifyFalseCompletion } from '@/src/lib/ai';
import { POINTS } from '@/src/constants';
import type { IssueReport, FalseCompletion } from '@/src/types';

export type ReportFalseCompletionInput = {
  issue: IssueReport;
  reporterId: string;
  description: string;
};

export async function processFalseCompletionReport(input: ReportFalseCompletionInput): Promise<{
  updatedIssue: IssueReport;
  falseCompletionRecord: FalseCompletion;
  pointsAwarded: number;
}> {
  let verificationStatus = await verifyFalseCompletion({
    beforeImageUri: input.issue.photoUri ?? '',
    afterImageUri: input.issue.afterPhotoUri ?? '',
    selectedCategory: input.issue.category,
    originalTitle: input.issue.title,
    originalDescription: input.issue.description,
    fixDescription: input.issue.fixDescription,
    falseCompletionDescription: input.description,
  });

  const isVerifiedFalse = !verificationStatus.isValid; // If Gemini agrees it's NOT valid (reviewer is correct), it's a verified false completion.

  const pointsToAward = isVerifiedFalse ? POINTS.falseCompletionReported ?? 50 : 0;

  const updatedIssue: IssueReport = isVerifiedFalse
    ? {
        ...input.issue,
        status: 'open',
        isFalseCompletion: true,
        // Optional: you could clear fixDescription here, but keeping it for context is fine
      }
    : input.issue;

  const record: FalseCompletion = {
    id: 'temp-record-' + Date.now().toString(),
    issueId: input.issue.id,
    reporterId: input.reporterId,
    description: input.description,
    verificationResult: verificationStatus,
    isVerified: isVerifiedFalse,
    createdAt: new Date().toISOString(),
  };

  return {
    updatedIssue,
    falseCompletionRecord: record,
    pointsAwarded: pointsToAward,
  };
}
