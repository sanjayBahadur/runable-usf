import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GlossyButton } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';

type LoginFormProps = {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSwitchToSignup: () => void;
  onDemoMode: () => void;
  loading: boolean;
  error: string | null;
};

export function LoginForm({
  onLogin,
  onSwitchToSignup,
  onDemoMode,
  loading,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) return;
    await onLogin(email.trim(), password);
  }

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <ThemedText type="defaultSemiBold">Email</ThemedText>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@usf.edu"
          placeholderTextColor={RUNABLE_THEME.colors.ink}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="defaultSemiBold">Password</ThemedText>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor={RUNABLE_THEME.colors.ink}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      ) : null}

      <GlossyButton
        label={loading ? 'Signing in…' : 'Sign In'}
        onPress={() => { void handleSubmit(); }}
        tone="dark"
      />

      <GlossyButton
        label="Create Account"
        onPress={onSwitchToSignup}
        tone="primary"
      />

      <GlossyButton
        label="Continue as Demo"
        onPress={onDemoMode}
        tone="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: RUNABLE_THEME.spacing.sm,
  },
  field: {
    gap: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
    borderRadius: RUNABLE_THEME.radii.sm,
    paddingHorizontal: RUNABLE_THEME.spacing.sm,
    paddingVertical: 10,
    backgroundColor: RUNABLE_THEME.colors.paper,
    color: RUNABLE_THEME.colors.ink,
    fontSize: RUNABLE_THEME.fontSizes.md,
  },
  errorBox: {
    padding: RUNABLE_THEME.spacing.sm,
    borderRadius: RUNABLE_THEME.radii.sm,
    backgroundColor: '#F8D9D6',
    borderWidth: 1,
    borderColor: RUNABLE_THEME.colors.issueRed,
  },
  errorText: {
    color: RUNABLE_THEME.colors.issueRed,
    fontSize: RUNABLE_THEME.fontSizes.sm,
  },
});
