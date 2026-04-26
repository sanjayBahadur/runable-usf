import { useEffect, useState } from 'react';

import { createIssueReport } from '@/src/features/issues/createIssueReport';
import { fixIssue } from '@/src/features/issues/fixIssue';
import { createIssue, getIssues, updateIssue } from '@/src/lib/supabase/issueService';
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

  useEffect(() => {
    async function load() {
      try {
        const data = await getIssues();
        if (data && data.length > 0) {
          const mapped: IssueReport[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            category: d.category,
            description: d.description,
            coordinate: d.coordinate,
            status: d.status,
            reportedByUserId: d.reported_by_user_id,
            fixedByUserId: d.fixed_by_user_id,
            photoUri: d.photo_uri,
            afterPhotoUri: d.after_photo_uri,
            createdAt: d.created_at,
            fixedAt: d.fixed_at,
          }));
          setIssues(mapped);
        }
      } catch (err) {
        console.warn('Failed to load real issues, using demo', err);
      }
    }
    load();
  }, []);

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

    createIssue({
      id: issue.id,
      title: issue.title,
      category: issue.category,
      description: issue.description,
      coordinate: issue.coordinate,
      status: issue.status,
      reported_by_user_id: issue.reportedByUserId,
      photo_uri: issue.photoUri,
      created_at: issue.createdAt,
    }).catch((e) => console.error("Failed to commit issue up to Supabase", e));

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

    updateIssue(issueId, {
      status: 'fixed',
      fixed_by_user_id: currentUserId,
      after_photo_uri: afterPhotoUri,
      fixed_at: result.issue.fixedAt,
    }).catch(e => console.error("Failed to update issue on Supabase", e));

    return result;
  }

  return {
    issues,
    reportIssue,
    markIssueFixed,
  };
}
