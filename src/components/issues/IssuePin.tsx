import { Marker } from 'react-native-maps';

import { STATUS_COLORS } from '@/src/constants';
import type { IssueReport } from '@/src/types';

type IssuePinProps = {
  issue: IssueReport;
  onPress?: (issueId: string) => void;
};

export function IssuePin({ issue, onPress }: IssuePinProps) {
  return (
    <Marker
      coordinate={{ latitude: issue.coordinate[0], longitude: issue.coordinate[1] }}
      pinColor={issue.status === 'fixed' ? STATUS_COLORS.issueFixed : STATUS_COLORS.issueOpen}
      title={issue.title}
      description={issue.description}
      onPress={() => onPress?.(issue.id)}
    />
  );
}
