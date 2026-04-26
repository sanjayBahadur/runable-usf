import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import * as Location from 'expo-location';

import { calculateDistanceMeters } from '@/src/lib/geometry';
import { useLocationPermission } from '@/src/hooks/useLocationPermission';
import type { Coordinate, RunPoint, RunSession } from '@/src/types';

export type RunTrackerStatus =
  | 'idle'
  | 'permissionDenied'
  | 'recording'
  | 'paused'
  | 'finished'
  | 'error';

type UseRunTrackerOptions = {
  userId: string;
  groupId: string;
  minPointDistanceMeters?: number;
};

function buildRunPoint(location: Location.LocationObject): RunPoint {
  return {
    coordinate: [location.coords.latitude, location.coords.longitude],
    recordedAt: new Date(location.timestamp).toISOString(),
    accuracyMeters: location.coords.accuracy ?? undefined,
  };
}

export function useRunTracker({
  userId,
  groupId,
  minPointDistanceMeters = 3,
}: UseRunTrackerOptions) {
  const { permissionStatus, canAskAgain, isLoading, requestPermission, refreshPermission } =
    useLocationPermission();
  const [status, setStatus] = useState<RunTrackerStatus>('idle');
  const [path, setPath] = useState<RunPoint[]>([]);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedRun, setCompletedRun] = useState<RunSession | null>(null);

  const startedAtRef = useRef<string | null>(null);
  const startedAtMsRef = useRef<number | null>(null);
  const pausedAtMsRef = useRef<number | null>(null);
  const pausedDurationMsRef = useRef(0);
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const clearWatcher = useCallback(() => {
    locationSubscriptionRef.current?.remove();
    locationSubscriptionRef.current = null;
  }, []);

  const resetRunState = useCallback(() => {
    setPath([]);
    setDistanceMeters(0);
    setElapsedSeconds(0);
    setCompletedRun(null);
    setErrorMessage(null);
    startedAtRef.current = null;
    startedAtMsRef.current = null;
    pausedAtMsRef.current = null;
    pausedDurationMsRef.current = 0;
  }, []);

  const appendLocation = useCallback(
    (location: Location.LocationObject) => {
      const nextPoint = buildRunPoint(location);
      setCurrentLocation(nextPoint.coordinate);

      setPath((existing) => {
        const lastPoint = existing[existing.length - 1];
        if (lastPoint) {
          const segmentDistance = calculateDistanceMeters(lastPoint.coordinate, nextPoint.coordinate);
          if (segmentDistance < minPointDistanceMeters) {
            return existing;
          }

          setDistanceMeters((current) => current + segmentDistance);
        }

        return [...existing, nextPoint];
      });
    },
    [minPointDistanceMeters],
  );

  const beginWatching = useCallback(async () => {
    clearWatcher();

    locationSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 5,
        timeInterval: 3000,
      },
      appendLocation,
    );
  }, [appendLocation, clearWatcher]);

  const startRun = useCallback(async () => {
    setErrorMessage(null);

    const granted =
      permissionStatus === 'granted'
        ? true
        : canAskAgain
          ? await requestPermission()
          : await refreshPermission();

    if (!granted) {
      setStatus('permissionDenied');
      setErrorMessage('Location permission is required to start a real run.');
      return null;
    }

    clearWatcher();
    resetRunState();

    const now = new Date();
    startedAtRef.current = now.toISOString();
    startedAtMsRef.current = now.getTime();
    setStatus('recording');

    try {
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      appendLocation(initialLocation);
      await beginWatching();
      return startedAtRef.current;
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to start location tracking.');
      return null;
    }
  }, [
    appendLocation,
    beginWatching,
    canAskAgain,
    clearWatcher,
    permissionStatus,
    refreshPermission,
    requestPermission,
    resetRunState,
  ]);

  const pauseRun = useCallback(() => {
    if (status !== 'recording') {
      return;
    }

    pausedAtMsRef.current = Date.now();
    clearWatcher();
    setStatus('paused');
  }, [clearWatcher, status]);

  const resumeRun = useCallback(async () => {
    if (status !== 'paused') {
      return;
    }

    if (pausedAtMsRef.current) {
      pausedDurationMsRef.current += Date.now() - pausedAtMsRef.current;
      pausedAtMsRef.current = null;
    }

    try {
      await beginWatching();
      setStatus('recording');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to resume location tracking.');
    }
  }, [beginWatching, status]);

  const finishRun = useCallback(() => {
    if (status !== 'recording' && status !== 'paused') {
      return null;
    }

    if (status === 'paused' && pausedAtMsRef.current) {
      pausedDurationMsRef.current += Date.now() - pausedAtMsRef.current;
      pausedAtMsRef.current = null;
    }

    clearWatcher();

    const endedAt = new Date().toISOString();
    const runSession: RunSession = {
      id: `run-${Date.now()}`,
      userId,
      groupId,
      path,
      startedAt: startedAtRef.current ?? endedAt,
      endedAt,
      distanceMeters,
      status: 'completed',
    };

    setCompletedRun(runSession);
    setStatus('finished');
    return runSession;
  }, [clearWatcher, distanceMeters, groupId, path, status, userId]);

  const cancelRun = useCallback(() => {
    clearWatcher();
    resetRunState();
    setStatus('idle');
  }, [clearWatcher, resetRunState]);

  useEffect(() => {
    if (status !== 'recording' || !startedAtMsRef.current) {
      return;
    }

    const interval = setInterval(() => {
      const elapsedMs = Date.now() - startedAtMsRef.current! - pausedDurationMsRef.current;
      setElapsedSeconds(Math.max(0, Math.floor(elapsedMs / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => () => clearWatcher(), [clearWatcher]);

  const livePathCoordinates = useMemo(
    () => path.map((point) => point.coordinate),
    [path],
  );

  return {
    status,
    path,
    livePathCoordinates,
    distanceMeters,
    elapsedSeconds,
    currentLocation,
    completedRun,
    errorMessage,
    permissionStatus,
    permissionLoading: isLoading,
    startRun,
    pauseRun,
    resumeRun,
    finishRun,
    cancelRun,
  };
}
