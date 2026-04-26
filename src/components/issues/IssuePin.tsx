import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';

import { STATUS_COLORS } from '@/src/constants';
import type { IssueReport } from '@/src/types';

type IssuePinProps = {
  issue: IssueReport;
  onPress?: (issueId: string) => void;
};

export function IssuePin({ issue, onPress }: IssuePinProps) {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  // Stop actively re-rendering the marker snapshot constantly. 
  // It destroys frame-rates and eats touches on Android/iOS causing glitching.
  // We allow an initial 500ms for FontAwesome5 to grab the native glyph font before freezing the raster.
  useEffect(() => {
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Marker
      coordinate={{ latitude: issue.coordinate[0], longitude: issue.coordinate[1] }}
      tracksViewChanges={tracksViewChanges}
      onPress={(e) => {
        e.stopPropagation();
        onPress?.(issue.id);
      }}
    >
      <View style={styles.pinContainer}>
        <FontAwesome5
          name="exclamation-triangle"
          size={16}
          color={issue.status === 'fixed' ? STATUS_COLORS.issueFixed : STATUS_COLORS.issueOpen}
        />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#94A3B8',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
