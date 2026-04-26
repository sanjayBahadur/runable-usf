import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

import { supabase } from '@/src/lib/supabase/client';

export type AuthResult = {
  user: User | null;
  error: string | null;
};

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string,
): Promise<AuthResult> {
  if (!supabase) {
    return { user: null, error: 'Supabase is not configured.' };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName ?? email.split('@')[0] },
    },
  });

  return { user: data.user ?? null, error: error?.message ?? null };
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  if (!supabase) {
    return { user: null, error: 'Supabase is not configured.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { user: data.user ?? null, error: error?.message ?? null };
}

export async function signOut(): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: null };
  }

  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!supabase) {
    return null;
  }

  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
): (() => void) | null {
  if (!supabase) {
    return null;
  }

  const { data } = supabase.auth.onAuthStateChange(callback);
  return () => data.subscription.unsubscribe();
}
