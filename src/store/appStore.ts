import { create } from 'zustand';

import type { Group, UserProfile } from '@/src/types';

export type AppMode = 'demo' | 'preview' | 'campus';
export type AuthState = 'anonymous' | 'loading' | 'authenticated';

type AppStore = {
  // ── Auth state ──
  authState: AuthState;
  user: UserProfile | null;
  group: Group | null;
  supabaseAvailable: boolean;

  // ── App mode ──
  appMode: AppMode;
  showAuthGate: boolean;

  // ── Actions ──
  setAuthState: (state: AuthState) => void;
  setUser: (user: UserProfile | null) => void;
  setGroup: (group: Group | null) => void;
  setSupabaseAvailable: (available: boolean) => void;
  setAppMode: (mode: AppMode) => void;
  setShowAuthGate: (show: boolean) => void;

  signOut: () => void;
  requestCampusMode: () => boolean;
};

export const useAppStore = create<AppStore>((set, get) => ({
  authState: 'anonymous',
  user: null,
  group: null,
  supabaseAvailable: false,
  appMode: 'preview',
  showAuthGate: false,

  setAuthState: (authState) => set({ authState }),
  setUser: (user) => set({ user }),
  setGroup: (group) => set({ group }),
  setSupabaseAvailable: (supabaseAvailable) => set({ supabaseAvailable }),
  setAppMode: (appMode) => set({ appMode }),
  setShowAuthGate: (showAuthGate) => set({ showAuthGate }),

  signOut: () =>
    set({
      authState: 'anonymous',
      user: null,
      group: null,
      appMode: 'preview',
      showAuthGate: false,
    }),

  /**
   * Called when the user tries to switch to campus mode.
   * Returns true if the user is authenticated and campus mode is set.
   * Returns false and opens the auth gate if not authenticated.
   */
  requestCampusMode: () => {
    const { authState } = get();
    if (authState === 'authenticated') {
      set({ appMode: 'campus', showAuthGate: false });
      return true;
    }
    set({ showAuthGate: true });
    return false;
  },
}));
