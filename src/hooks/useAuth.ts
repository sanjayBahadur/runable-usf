import { useCallback, useEffect, useState } from 'react';

import { useAppStore } from '@/src/store/appStore';
import {
  signUpWithEmail,
  signInWithEmail,
  signOut as supabaseSignOut,
  getCurrentSession,
  onAuthStateChange,
  isSupabaseConfigured,
  getUserProfile,
} from '@/src/lib/supabase';
import type { UserProfile } from '@/src/types';

function profileFromRow(row: Record<string, unknown>): UserProfile {
  return {
    id: String(row.id ?? ''),
    username: String(row.username ?? ''),
    displayName: String(row.display_name ?? ''),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
    homeGroupId: row.home_group_id ? String(row.home_group_id) : undefined,
    groupRole:
      row.group_role === 'executive' || row.group_role === 'member'
        ? row.group_role
        : undefined,
    points: Number(row.points ?? 0),
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

export function useAuth() {
  const {
    authState,
    user,
    group,
    appMode,
    showAuthGate,
    setAuthState,
    setUser,
    setSupabaseAvailable,
    setShowAuthGate,
    signOut: storeSignOut,
    requestCampusMode,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bootstrap: check for existing session on mount
  useEffect(() => {
    const available = isSupabaseConfigured();
    setSupabaseAvailable(available);

    if (!available) {
      setAuthState('anonymous');
      return;
    }

    setAuthState('loading');

    void getCurrentSession().then(async (session) => {
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          setUser(profileFromRow(profile));
        }
        setAuthState('authenticated');
      } else {
        setAuthState('anonymous');
      }
    });

    const unsubscribe = onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          setUser(profileFromRow(profile));
        }
        setAuthState('authenticated');
      } else {
        storeSignOut();
      }
    });

    return () => {
      unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      const result = await signInWithEmail(email, password);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return false;
      }

      if (result.user) {
        const profile = await getUserProfile(result.user.id);
        if (profile) {
          setUser(profileFromRow(profile));
        }
        setAuthState('authenticated');
        setShowAuthGate(false);
      }

      setLoading(false);
      return !result.error;
    },
    [setAuthState, setShowAuthGate, setUser],
  );

  const handleSignUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      setLoading(true);
      setError(null);

      const result = await signUpWithEmail(email, password, displayName);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return false;
      }

      if (result.user) {
        // Wait a moment for the profile trigger to fire
        await new Promise((resolve) => setTimeout(resolve, 500));
        const profile = await getUserProfile(result.user.id);
        if (profile) {
          setUser(profileFromRow(profile));
        }
        setAuthState('authenticated');
        setShowAuthGate(false);
      }

      setLoading(false);
      return !result.error;
    },
    [setAuthState, setShowAuthGate, setUser],
  );

  const handleSignOut = useCallback(async () => {
    await supabaseSignOut();
    storeSignOut();
  }, [storeSignOut]);

  return {
    isAuthenticated: authState === 'authenticated',
    authState,
    user,
    group,
    appMode,
    showAuthGate,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    requestCampusMode,
    dismissAuthGate: () => setShowAuthGate(false),
  };
}
