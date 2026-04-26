import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PixelChip } from '@/src/components/ui';
import { RUNABLE_THEME } from '@/src/constants/theme';
import type { CampusAccessState } from '@/src/lib/campus';

type CampusStatusChipProps = {
  campusName: string;
  accessState: CampusAccessState;
};

function getLabel(accessState: CampusAccessState): string {
  switch (accessState) {
    case 'onCampus':
      return 'On Campus';
    case 'nearCampus':
      return 'Near Campus';
    case 'offCampus':
      return 'Preview Mode';
    case 'unknown':
    default:
      return 'Campus Mode';
  }
}

export function CampusStatusChip({ campusName, accessState }: CampusStatusChipProps) {
  const tone = accessState === 'onCampus' ? 'green' : 'gold';

  return (
    <View style={[styles.container, accessState === 'onCampus' ? styles.active : styles.preview]}>
      <View style={styles.titleWrap}>
        <View style={styles.dot} />
        <ThemedText type="defaultSemiBold" style={styles.campusName}>{campusName}</ThemedText>
      </View>
      <PixelChip label={getLabel(accessState)} tone={tone} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RUNABLE_THEME.radii.md,
    backgroundColor: RUNABLE_THEME.colors.paper,
    borderWidth: 2,
    ...RUNABLE_THEME.shadows.soft,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  campusName: {
    color: RUNABLE_THEME.colors.campusGreen,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: RUNABLE_THEME.colors.campusGreen,
  },
  active: {
    borderColor: RUNABLE_THEME.colors.campusGreen,
  },
  preview: {
    borderColor: RUNABLE_THEME.colors.border,
  },
});
