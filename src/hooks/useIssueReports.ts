import { useEffect, useState } from 'react';

import { createIssueReport } from '@/src/features/issues/createIssueReport';
import { fixIssue } from '@/src/features/issues/fixIssue';
import { processFalseCompletionReport } from '@/src/features/issues/reportFalseCompletion';
import { createIssue, getIssues, updateIssue } from '@/src/lib/supabase/issueService';
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
  const [issues, setIssues] = useState<IssueReport[]>(initialIssues);

  useEffect(() => {
    if (!enabled) {
      setIssues(initialIssues);
      return;
    }
    async function load() {
      try {
        const data = await getIssues();
        setIssues(data);
      } catch (err) {
        console.warn('Failed to load real issues, using demo', err);
      }
    }
    void load();
  }, [enabled, initialIssues]);

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

    setIssues((existing) => [issue, ...existing]);

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
    }).then((persistedId) => {
      if (!persistedId) return;
      setIssues((existing) => existing.map((entry) => (
        entry.id === issue.id ? { ...entry, id: persistedId } : entry
      )));
    }).catch((e) => console.error("Failed to commit issue up to Supabase", e));

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

    setIssues((existing) =>
      existing.map((entry) => (entry.id === issueId ? result.issue : entry)),
    );

    if (!enabled) {
      return result;
    }

    updateIssue(issueId, {
      status: 'fixed',
      fixed_by_user_id: currentUserId,
      after_photo_path: afterPhotoUri,
      fixed_at: result.issue.fixedAt,
    }).catch(e => console.error("Failed to update issue on Supabase", e));

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

    setIssues((existing) =>
      existing.map((entry) => (entry.id === issueId ? result.updatedIssue : entry)),
    );

    if (enabled && result.updatedIssue.status === 'open' && result.falseCompletionRecord.isVerified) {
      await updateIssue(issueId, {
        status: 'open',
        is_false_completion: true,
      });
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
