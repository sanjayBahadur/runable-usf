import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MapView, { type LongPressEvent, type MapPressEvent, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import { USF_ACCESS_BOUNDARY, USF_BOARD_BOUNDARY, USF_CAMERA_PADDING } from '@/src/constants';
import { ThemedText } from '@/components/themed-text';
import { clampRegionToCampus, getInitialCampusRegion, type CampusRegion } from '@/src/lib/campus';
import { isPointInsidePolygon } from '@/src/lib/geometry';
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
  simulatorActive?: boolean;
  onToggleSimulator?: () => void;
  onCellPress?: (cellId: string) => void;
  onIssuePress?: (issueId: string) => void;
  onSightingPress?: (sightingId: string) => void;
  onMapLongPress?: (coordinate: Coordinate) => void;
  onMapPress?: (coordinate: Coordinate) => void;
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
  simulatorActive = false,
  onToggleSimulator,
  onCellPress,
  onIssuePress,
  onSightingPress,
  onMapLongPress,
  onMapPress,
}: CampusMapProps) {
  const mapRef = useRef<MapView | null>(null);
  const insets = useSafeAreaInsets();
  const [gpsLocation, setGpsLocation] = useState<Coordinate | null>(null);
  const hasInitialCentered = useRef(false);

  // Try to get the user's real GPS location on mount
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) return;

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (cancelled) return;

        const coord: Coordinate = [location.coords.latitude, location.coords.longitude];
        setGpsLocation(coord);

        // Auto-center on user if they're on campus
        if (!hasInitialCentered.current && isPointInsidePolygon(coord, USF_ACCESS_BOUNDARY)) {
          hasInitialCentered.current = true;
          mapRef.current?.animateToRegion(
            {
              latitude: coord[0],
              longitude: coord[1],
              latitudeDelta: 0.006,
              longitudeDelta: 0.009,
            },
            600,
          );
        }
      } catch {
        // GPS unavailable — no problem, just use default campus view
      }
    })();

    return () => { cancelled = true; };
  }, []);

  function handleMapLongPress(event: LongPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onMapLongPress?.([latitude, longitude]);
  }

  function handleMapPress(event: MapPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onMapPress?.([latitude, longitude]);
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

  function goToMyLocation() {
    const target = gpsLocation ?? (userLocation ?? null);
    if (!target) {
      recenterToCampus();
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude: target[0],
        longitude: target[1],
        latitudeDelta: 0.005,
        longitudeDelta: 0.008,
      },
      400,
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        showsUserLocation={false}
        onPress={handleMapPress}
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
        <UserLocationMarker userLocation={gpsLocation ?? userLocation} />
      </MapView>

      {/* Map controls — XP style */}
      <View
        pointerEvents="box-none"
        style={[styles.controlsWrap, { top: insets.top + 12, right: USF_CAMERA_PADDING.right }]}>
        <MapLegend groups={groups} />

        {/* Simulator toggle button */}
        <Pressable
          onPress={onToggleSimulator}
          style={({ pressed }) => [
            styles.mapButton,
            pressed ? styles.mapButtonPressed : null,
            simulatorActive ? styles.simulatorActiveButton : null,
          ]}>
          <ThemedText style={styles.mapButtonText}>🕹️</ThemedText>
        </Pressable>

        {/* My Location button */}
        <Pressable
          onPress={goToMyLocation}
          style={({ pressed }) => [styles.mapButton, pressed ? styles.mapButtonPressed : null]}>
          <View style={styles.locationIcon}>
            <View style={styles.locationDot} />
            <View style={styles.locationRing} />
            <View style={[styles.locationArrow, styles.arrowTop]} />
            <View style={[styles.locationArrow, styles.arrowRight]} />
            <View style={[styles.locationArrow, styles.arrowBottom]} />
            <View style={[styles.locationArrow, styles.arrowLeft]} />
          </View>
        </Pressable>

        {/* Recenter button */}
        <Pressable
          onPress={recenterToCampus}
          style={({ pressed }) => [styles.mapButton, pressed ? styles.mapButtonPressed : null]}>
          <ThemedText style={styles.mapButtonText}>⌂</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlsWrap: {
    position: 'absolute',
    alignItems: 'flex-end',
    gap: 8,
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: RUNABLE_THEME.radii.sm,
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...RUNABLE_THEME.shadows.soft,
  },
  simulatorActiveButton: {
    backgroundColor: RUNABLE_THEME.colors.cream,
    borderColor: RUNABLE_THEME.colors.xpBlue,
  },
  mapButtonPressed: {
    transform: [{ translateY: 1 }],
    backgroundColor: RUNABLE_THEME.colors.windowGray,
  },
  mapButtonText: {
    fontSize: 20,
    lineHeight: 24,
  },

  // XP-style location crosshair icon
  locationIcon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: RUNABLE_THEME.colors.xpBlue,
    position: 'absolute',
  },
  locationRing: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.xpBlue,
    position: 'absolute',
  },
  locationArrow: {
    position: 'absolute',
    width: 2,
    height: 5,
    backgroundColor: RUNABLE_THEME.colors.border,
  },
  arrowTop: {
    top: 0,
    left: 10,
  },
  arrowBottom: {
    bottom: 0,
    left: 10,
  },
  arrowLeft: {
    left: 0,
    top: 10,
    width: 5,
    height: 2,
  },
  arrowRight: {
    right: 0,
    top: 10,
    width: 5,
    height: 2,
  },
});
