import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

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
        style={styles.button}>
        <ThemedText>Post</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(14, 165, 233, 0.14)',
  },
});
