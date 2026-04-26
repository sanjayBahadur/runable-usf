import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL
  ?? process.env.EXPO_PUBLIC_SUPABASE_URL
  ?? '';

const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY
  ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  ?? '';

/**
 * Returns true when both Supabase environment variables are present.
 * The app falls back to demo mode when this returns false.
 */
export function isSupabaseConfigured(): boolean {
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
}

/**
 * Simple in-memory storage adapter that satisfies the Supabase auth
 * storage interface. Works everywhere including Expo Go without needing
 * a native module. Sessions persist for the app lifetime only.
 */
const memoryStorage: Record<string, string> = {};
const inMemoryStorage = {
  getItem: (key: string) => memoryStorage[key] ?? null,
  setItem: (key: string, value: string) => { memoryStorage[key] = value; },
  removeItem: (key: string) => { delete memoryStorage[key]; },
};

/**
 * Try to load AsyncStorage, fall back to in-memory if native module is missing.
 */
function getStorage() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    // Quick check — if the native module is null this will throw
    if (AsyncStorage) return AsyncStorage;
  } catch {
    // Native module not available (Expo Go, etc.)
  }
  return inMemoryStorage;
}

/**
 * Supabase client — only created when env vars are available.
 * Import this and check for `null` before making any calls.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: getStorage(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
