import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';

import { STATUS_COLORS } from '@/src/constants';
import type { Sighting } from '@/src/types';

type SightingPinLayerProps = {
  sightings: Sighting[];
  onSightingPress?: (sightingId: string) => void;
};

type SightingPinProps = {
  sighting: Sighting;
  onPress?: (sightingId: string) => void;
};

export function SightingPin({ sighting, onPress }: SightingPinProps) {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Marker
      coordinate={{ latitude: sighting.coordinate[0], longitude: sighting.coordinate[1] }}
      tracksViewChanges={tracksViewChanges}
      onPress={(e) => {
        e.stopPropagation();
        onPress?.(sighting.id);
      }}
    >
      <View style={[styles.pinContainer, sighting.category === 'landmark' ? styles.landmarkPin : null]}>
        <FontAwesome5 
          name={sighting.category === 'landmark' ? 'landmark' : 'paw'} 
          size={14} 
          color={STATUS_COLORS.sighting} 
        />
      </View>
    </Marker>
  );
}

export function SightingPinLayer({ sightings, onSightingPress }: SightingPinLayerProps) {
  return (
    <>
      {sightings.map((sighting) => (
        <SightingPin key={sighting.id} sighting={sighting} onPress={onSightingPress} />
      ))}
    </>
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
  landmarkPin: {
    borderColor: '#CBD5E1', 
    backgroundColor: '#F8FAFC',
  },
});
