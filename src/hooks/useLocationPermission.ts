import { useCallback, useEffect, useState } from 'react';

import * as Location from 'expo-location';

type LocationPermissionState = 'unknown' | 'granted' | 'denied';

export function useLocationPermission() {
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionState>('unknown');
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const syncPermission = useCallback((status: Location.PermissionStatus, askAgain: boolean) => {
    setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
    setCanAskAgain(askAgain);
  }, []);

  const refreshPermission = useCallback(async () => {
    setIsLoading(true);

    try {
      const permission = await Location.getForegroundPermissionsAsync();
      syncPermission(permission.status, permission.canAskAgain);
      return permission.status === 'granted';
    } finally {
      setIsLoading(false);
    }
  }, [syncPermission]);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      syncPermission(permission.status, permission.canAskAgain);
      return permission.status === 'granted';
    } finally {
      setIsLoading(false);
    }
  }, [syncPermission]);

  useEffect(() => {
    void refreshPermission();
  }, [refreshPermission]);

  return {
    permissionStatus,
    canAskAgain,
    isLoading,
    granted: permissionStatus === 'granted',
    requestPermission,
    refreshPermission,
  };
}
