import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';

type CommentInputProps = {
  onSubmit: (comment: string) => void;
};

export function CommentInput({ onSubmit }: CommentInputProps) {
  const [value, setValue] = useState('');

  return (
    <View style={styles.row}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Add a local comment"
        placeholderTextColor={RUNABLE_THEME.colors.ink}
        style={styles.input}
      />
      <Pressable
        onPress={() => {
          const trimmed = value.trim();
          if (!trimmed) {
            return;
          }
          onSubmit(trimmed);
          setValue('');
        }}
        style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}>
        <ThemedText type="defaultSemiBold">Post</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: RUNABLE_THEME.spacing.xs,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
    borderRadius: RUNABLE_THEME.radii.sm,
    paddingHorizontal: RUNABLE_THEME.spacing.sm,
    paddingVertical: 10,
    backgroundColor: RUNABLE_THEME.colors.paper,
    color: RUNABLE_THEME.colors.ink,
    fontSize: RUNABLE_THEME.fontSizes.sm,
  },
  button: {
    paddingHorizontal: RUNABLE_THEME.spacing.sm,
    paddingVertical: 10,
    borderRadius: RUNABLE_THEME.radii.sm,
    borderWidth: 2,
    borderColor: RUNABLE_THEME.colors.border,
    backgroundColor: RUNABLE_THEME.colors.cream,
    ...RUNABLE_THEME.shadows.soft,
  },
  pressed: {
    transform: [{ translateY: 1 }],
    backgroundColor: RUNABLE_THEME.colors.windowGray,
  },
});
