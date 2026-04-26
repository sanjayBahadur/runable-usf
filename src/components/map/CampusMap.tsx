import { StyleSheet, View } from 'react-native';
import MapView, { type LongPressEvent } from 'react-native-maps';

import { CAMPUS_CONFIG } from '@/src/constants';
import { PixelArtOverlay } from '@/src/components/art';
import { CampusBoundaryLayer } from '@/src/components/map/CampusBoundaryLayer';
import { IssuePinLayer } from '@/src/components/map/IssuePinLayer';
import { MapLegend } from '@/src/components/map/MapLegend';
import { RunPathLayer } from '@/src/components/map/RunPathLayer';
import { SightingPinLayer } from '@/src/components/map/SightingPinLayer';
import { TerritoryCellLayer } from '@/src/components/map/TerritoryCellLayer';
import { UserLocationMarker } from '@/src/components/map/UserLocationMarker';
import type {
  CampusCell,
  CellArt,
  CellOwnership,
  Coordinate,
  Group,
  IssueReport,
  Sighting,
} from '@/src/types';

type CampusMapProps = {
  campusBoundary?: Coordinate[];
  userLocation?: Coordinate | null;
  runPath?: Coordinate[] | Coordinate[][];
  cells: CampusCell[];
  cellArt?: CellArt[];
  ownership: CellOwnership[];
  issues: IssueReport[];
  sightings: Sighting[];
  groups: Group[];
  onCellPress?: (cellId: string) => void;
  onIssuePress?: (issueId: string) => void;
  onSightingPress?: (sightingId: string) => void;
  onMapLongPress?: (coordinate: Coordinate) => void;
};

const INITIAL_REGION = {
  latitude: CAMPUS_CONFIG.center[0],
  longitude: CAMPUS_CONFIG.center[1],
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

export function CampusMap({
  campusBoundary = CAMPUS_CONFIG.boundary,
  userLocation,
  runPath,
  cells,
  cellArt = [],
  ownership,
  issues,
  sightings,
  groups,
  onCellPress,
  onIssuePress,
  onSightingPress,
  onMapLongPress,
}: CampusMapProps) {
  function handleMapLongPress(event: LongPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onMapLongPress?.([latitude, longitude]);
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        onLongPress={handleMapLongPress}>
        <CampusBoundaryLayer boundary={campusBoundary} />
        <TerritoryCellLayer
          cells={cells}
          ownership={ownership}
          groups={groups}
          onCellPress={onCellPress}
        />
        <PixelArtOverlay cells={cells} cellArt={cellArt} />
        <RunPathLayer runPath={runPath} />
        <IssuePinLayer issues={issues} onIssuePress={onIssuePress} />
        <SightingPinLayer sightings={sightings} onSightingPress={onSightingPress} />
        <UserLocationMarker userLocation={userLocation} />
      </MapView>
      <View pointerEvents="box-none" style={styles.legendWrap}>
        <MapLegend groups={groups} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  legendWrap: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 90,
  },
});
