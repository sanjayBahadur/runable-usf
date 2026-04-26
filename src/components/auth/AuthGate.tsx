import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GlossyButton, XPWindow } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';

import { LoginForm } from '@/src/components/auth/LoginForm';
import { SignupForm } from '@/src/components/auth/SignupForm';

type AuthGateProps = {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignup: (email: string, password: string, displayName?: string) => Promise<boolean>;
  onDemoMode: () => void;
  onDismiss: () => void;
  loading: boolean;
  error: string | null;
};

export function AuthGate({
  onLogin,
  onSignup,
  onDemoMode,
  onDismiss,
  loading,
  error,
}: AuthGateProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <View style={styles.backdrop}>
      <View style={styles.content}>
        <XPWindow
          title={mode === 'login' ? 'Sign In to Runable' : 'Create Account'}
          icon={mode === 'login' ? '🔑' : '📝'}
          action={
            <GlossyButton label="✕" onPress={onDismiss} tone="secondary" compact />
          }>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <ThemedText style={styles.subtitle}>
              {mode === 'login'
                ? 'Sign in to claim territory and compete on the USF campus board.'
                : 'Create an account to start running loops and claiming campus cells.'}
            </ThemedText>

            {mode === 'login' ? (
              <LoginForm
                onLogin={onLogin}
                onSwitchToSignup={() => setMode('signup')}
                onDemoMode={onDemoMode}
                loading={loading}
                error={error}
              />
            ) : (
              <SignupForm
                onSignup={onSignup}
                onSwitchToLogin={() => setMode('login')}
                onDemoMode={onDemoMode}
                loading={loading}
                error={error}
              />
            )}
          </ScrollView>
        </XPWindow>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 16, 32, 0.7)',
    padding: RUNABLE_THEME.spacing.lg,
    zIndex: RUNABLE_THEME.zIndex.gate,
  },
  content: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '85%',
  },
  scrollContent: {
    gap: RUNABLE_THEME.spacing.md,
    paddingBottom: RUNABLE_THEME.spacing.sm,
  },
  subtitle: {
    color: RUNABLE_THEME.colors.ink,
    fontSize: RUNABLE_THEME.fontSizes.sm,
  },
});
