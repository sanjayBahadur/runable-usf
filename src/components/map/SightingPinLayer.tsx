import { Marker } from 'react-native-maps';

import { STATUS_COLORS } from '@/src/constants';
import type { Sighting } from '@/src/types';

type SightingPinLayerProps = {
  sightings: Sighting[];
  onSightingPress?: (sightingId: string) => void;
};

export function SightingPinLayer({ sightings, onSightingPress }: SightingPinLayerProps) {
  return (
    <>
      {sightings.map((sighting) => (
        <Marker
          key={sighting.id}
          coordinate={{ latitude: sighting.coordinate[0], longitude: sighting.coordinate[1] }}
          pinColor={STATUS_COLORS.sighting}
          title={sighting.title}
          description={sighting.description}
          onPress={() => onSightingPress?.(sighting.id)}
        />
      ))}
    </>
  );
}
