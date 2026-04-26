import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { RUNABLE_THEME } from '@/src/constants/theme';

type WinnerBannerProps = {
  winnerName: string;
  cycle: string;
  period?: string;
};

export function WinnerBanner({ winnerName, cycle, period }: WinnerBannerProps) {
  const title = period ? `${period} Period` : cycle;

  return (
    <View style={styles.container}>
      <View style={styles.ribbon}>
        <FontAwesome5 name="trophy" size={16} color="#EAB308" />
        <ThemedText style={styles.text}>
          <ThemedText type="defaultSemiBold" style={styles.winnerName}>
            {winnerName}
          </ThemedText>{' '}
          dominated the {title}!
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: RUNABLE_THEME.spacing.sm,
  },
  ribbon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: RUNABLE_THEME.spacing.md,
    paddingVertical: RUNABLE_THEME.spacing.xs,
    borderRadius: RUNABLE_THEME.radii.md,
    borderWidth: 1,
    borderColor: '#FEF08A',
    gap: RUNABLE_THEME.spacing.sm,
  },
  text: {
    fontSize: 14,
    color: '#854D0E',
  },
  winnerName: {
    color: '#854D0E',
  },
});
