import { IssuePin } from '@/src/components/issues';
import type { IssueReport } from '@/src/types';

type IssuePinLayerProps = {
  issues: IssueReport[];
  onIssuePress?: (issueId: string) => void;
};

export function IssuePinLayer({ issues, onIssuePress }: IssuePinLayerProps) {
  return (
    <>
      {issues.map((issue) => (
        <IssuePin key={issue.id} issue={issue} onPress={onIssuePress} />
      ))}
    </>
  );
}
