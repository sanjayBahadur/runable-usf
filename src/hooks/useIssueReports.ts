import { useState } from 'react';

import { createIssueReport } from '@/src/features/issues/createIssueReport';
import { fixIssue } from '@/src/features/issues/fixIssue';
import type { Coordinate, IssueCategory, IssueReport } from '@/src/types';

type UseIssueReportsOptions = {
  initialIssues: IssueReport[];
  currentUserId: string;
  currentUserGroupId: string;
};

export function useIssueReports({
  initialIssues,
  currentUserId,
  currentUserGroupId,
}: UseIssueReportsOptions) {
  const [issues, setIssues] = useState<IssueReport[]>(initialIssues);

  function reportIssue(input: {
    title: string;
    category: IssueCategory;
    description?: string;
    coordinate: Coordinate;
    photoUri?: string;
  }) {
    const { issue, pointsAwarded } = createIssueReport({
      ...input,
      reportedByUserId: currentUserId,
    });

    setIssues((existing) => [issue, ...existing]);

    return { issue, pointsAwarded };
  }

  function markIssueFixed(issueId: string, afterPhotoUri?: string) {
    const issue = issues.find((entry) => entry.id === issueId);
    if (!issue || issue.status === 'fixed') {
      return null;
    }

    const result = fixIssue({
      issue,
      fixedByUserId: currentUserId,
      fixerGroupId: currentUserGroupId,
      issueCoordinate: issue.coordinate,
      afterPhotoUri,
    });

    setIssues((existing) =>
      existing.map((entry) => (entry.id === issueId ? result.issue : entry)),
    );

    return result;
  }

  return {
    issues,
    reportIssue,
    markIssueFixed,
  };
}
