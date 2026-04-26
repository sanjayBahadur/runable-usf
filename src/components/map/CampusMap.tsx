import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

import { CAMPUS_CONFIG } from '@/src/constants';
import { CampusBoundaryLayer } from '@/src/components/map/CampusBoundaryLayer';
import { IssuePinLayer } from '@/src/components/map/IssuePinLayer';
import { MapLegend } from '@/src/components/map/MapLegend';
import { RunPathLayer } from '@/src/components/map/RunPathLayer';
import { SightingPinLayer } from '@/src/components/map/SightingPinLayer';
import { TerritoryCellLayer } from '@/src/components/map/TerritoryCellLayer';
import { UserLocationMarker } from '@/src/components/map/UserLocationMarker';
import type { CampusCell, CellOwnership, Coordinate, Group, IssueReport, Sighting } from '@/src/types';

type CampusMapProps = {
  campusBoundary?: Coordinate[];
  userLocation?: Coordinate | null;
  runPath?: Coordinate[] | Coordinate[][];
  cells: CampusCell[];
  ownership: CellOwnership[];
  issues: IssueReport[];
  sightings: Sighting[];
  groups: Group[];
  onCellPress?: (cellId: string) => void;
  onIssuePress?: (issueId: string) => void;
  onSightingPress?: (sightingId: string) => void;
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
  ownership,
  issues,
  sightings,
  groups,
  onCellPress,
  onIssuePress,
  onSightingPress,
}: CampusMapProps) {
  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={INITIAL_REGION}>
        <CampusBoundaryLayer boundary={campusBoundary} />
        <TerritoryCellLayer
          cells={cells}
          ownership={ownership}
          groups={groups}
          onCellPress={onCellPress}
        />
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
