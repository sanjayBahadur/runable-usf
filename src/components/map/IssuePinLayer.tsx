import { Marker } from 'react-native-maps';

import { STATUS_COLORS } from '@/src/constants';
import type { IssueReport } from '@/src/types';

type IssuePinLayerProps = {
  issues: IssueReport[];
  onIssuePress?: (issueId: string) => void;
};

export function IssuePinLayer({ issues, onIssuePress }: IssuePinLayerProps) {
  return (
    <>
      {issues.map((issue) => (
        <Marker
          key={issue.id}
          coordinate={{ latitude: issue.coordinate[0], longitude: issue.coordinate[1] }}
          pinColor={issue.status === 'fixed' ? STATUS_COLORS.issueFixed : STATUS_COLORS.issueOpen}
          title={issue.title}
          description={issue.description}
          onPress={() => onIssuePress?.(issue.id)}
        />
      ))}
    </>
  );
}
