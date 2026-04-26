import { Text } from 'react-native';
import { Circle, Marker } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';

import type { Coordinate } from '@/src/types';

type UserLocationMarkerProps = {
  userLocation?: Coordinate | null;
};

export function UserLocationMarker({ userLocation }: UserLocationMarkerProps) {
  if (!userLocation) {
    return null;
  }

  const coordinate = { latitude: userLocation[0], longitude: userLocation[1] };

  return (
    <>
      <Circle
        center={coordinate}
        radius={18}
        fillColor="rgba(37, 99, 235, 0.18)"
        strokeColor="rgba(37, 99, 235, 0.5)"
      />
      <Marker coordinate={coordinate} title="You" anchor={{ x: 0.5, y: 0.5 }}>
        <FontAwesome5 name="running" size={20} color="#000" />
      </Marker>
    </>
  );
}
