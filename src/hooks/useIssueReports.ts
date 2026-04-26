import { useEffect } from 'react';

import { createIssueReport } from '@/src/features/issues/createIssueReport';
import { fixIssue } from '@/src/features/issues/fixIssue';
import { processFalseCompletionReport } from '@/src/features/issues/reportFalseCompletion';
import { createIssue, updateIssue } from '@/src/lib/supabase/issueService';
import { useIssueStore } from '@/src/store/issueStore';
import type { Coordinate, IssueCategory, IssueReport, PhotoVerificationResult } from '@/src/types';

type UseIssueReportsOptions = {
  initialIssues: IssueReport[];
  currentUserId: string;
  currentUserGroupId: string;
  enabled?: boolean;
};

export function useIssueReports({
  initialIssues,
  currentUserId,
  currentUserGroupId,
  enabled = true,
}: UseIssueReportsOptions) {
  const { issues, fetchIssues, updateIssueInState, addIssueToState } = useIssueStore();

  useEffect(() => {
    void fetchIssues(enabled, initialIssues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  function reportIssue(input: {
    title: string;
    category: IssueCategory;
    description?: string;
    coordinate: Coordinate;
    photoUri?: string;
    photoVerification?: PhotoVerificationResult;
  }) {
    const { issue, pointsAwarded } = createIssueReport({
      ...input,
      reportedByUserId: currentUserId,
    });

    addIssueToState(issue);

    if (!enabled) {
      return { issue, pointsAwarded };
    }

    createIssue({
      title: issue.title,
      category: issue.category,
      description: issue.description,
      coordinate: issue.coordinate,
      status: issue.status,
      reported_by_user_id: issue.reportedByUserId,
      photo_uri: issue.photoUri,
      created_at: issue.createdAt,
    })
      .then((persistedId) => {
        if (!persistedId) return;
        updateIssueInState(issue.id, { ...issue, id: persistedId });
      })
      .catch((e) => console.error('Failed to commit issue to Supabase', e));

    return { issue, pointsAwarded };
  }

  function markIssueFixed(
    issueId: string,
    afterPhotoUri?: string,
    fixVerification?: PhotoVerificationResult,
  ) {
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
      fixVerification,
    });

    updateIssueInState(issueId, result.issue);

    if (!enabled) {
      return result;
    }

    updateIssue(issueId, {
      status: 'fixed',
      fixed_by_user_id: currentUserId,
      after_photo_path: afterPhotoUri,
      fixed_at: result.issue.fixedAt,
    }).catch((e) => console.error('Failed to update issue on Supabase', e));

    return result;
  }

  async function reportFalseCompletion(issueId: string, description: string) {
    const issue = issues.find((i) => i.id === issueId);
    if (!issue) return null;

    const result = await processFalseCompletionReport({
      issue,
      reporterId: currentUserId,
      description,
    });

    // Update local state immediately — this is what makes the pin go back to red
    updateIssueInState(issueId, result.updatedIssue);

    // Persist to DB — only send fields that definitely exist in schema
    if (enabled && result.updatedIssue.status === 'open' && result.falseCompletionRecord.isVerified) {
      updateIssue(issueId, {
        status: 'open',
      }).catch((e) => console.error('Failed to reopen issue on Supabase', e));
    }

    return result;
  }

  return {
    issues,
    reportIssue,
    markIssueFixed,
    reportFalseCompletion,
  };
}
