import { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MapView, { type LongPressEvent, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { USF_ACCESS_BOUNDARY, USF_BOARD_BOUNDARY, USF_CAMERA_PADDING } from '@/src/constants';
import { ThemedText } from '@/components/themed-text';
import { clampRegionToCampus, getInitialCampusRegion, type CampusRegion } from '@/src/lib/campus';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { PixelArtOverlay } from '@/src/components/art';
import { CampusBoundaryLayer } from '@/src/components/map/CampusBoundaryLayer';
import { IssuePinLayer } from '@/src/components/map/IssuePinLayer';
import { MapLegend } from '@/src/components/map/MapLegend';
import { PlayableBoardLayer } from '@/src/components/map/PlayableBoardLayer';
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
  boardBoundary?: Coordinate[];
  userLocation?: Coordinate | null;
  runPath?: Coordinate[] | Coordinate[][];
  initialRegion?: CampusRegion;
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

export function CampusMap({
  boardBoundary = USF_BOARD_BOUNDARY,
  userLocation,
  runPath,
  initialRegion = getInitialCampusRegion(),
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
  const mapRef = useRef<MapView | null>(null);
  const insets = useSafeAreaInsets();

  function handleMapLongPress(event: LongPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onMapLongPress?.([latitude, longitude]);
  }

  function handleRegionChangeComplete(region: Region) {
    const clampedRegion = clampRegionToCampus(region);

    if (
      Math.abs(region.latitude - clampedRegion.latitude) > 0.0001 ||
      Math.abs(region.longitude - clampedRegion.longitude) > 0.0001 ||
      Math.abs(region.latitudeDelta - clampedRegion.latitudeDelta) > 0.0001 ||
      Math.abs(region.longitudeDelta - clampedRegion.longitudeDelta) > 0.0001
    ) {
      mapRef.current?.animateToRegion(clampedRegion, 200);
    }
  }

  function recenterToCampus() {
    const nextRegion = clampRegionToCampus(initialRegion);
    mapRef.current?.animateToRegion(nextRegion, 350);
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        onLongPress={handleMapLongPress}
        onRegionChangeComplete={handleRegionChangeComplete}>
        <PlayableBoardLayer boundary={boardBoundary} />
        <CampusBoundaryLayer boundary={USF_ACCESS_BOUNDARY} />
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
      <View
        pointerEvents="box-none"
        style={[styles.legendWrap, { top: insets.top + 12, right: USF_CAMERA_PADDING.right }]}>
        <MapLegend groups={groups} />
      </View>
      <View
        pointerEvents="box-none"
        style={[
          styles.recenterWrap,
          {
            top: insets.top + 62,
            right: USF_CAMERA_PADDING.right,
          },
        ]}>
        <Pressable onPress={recenterToCampus} style={styles.recenterButton}>
          <ThemedText>Recenter</ThemedText>
        </Pressable>
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
    alignItems: 'flex-end',
  },
  recenterWrap: {
    position: 'absolute',
  },
  recenterButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RUNABLE_THEME.radii.sm,
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
    ...RUNABLE_THEME.shadows.soft,
  },
});
