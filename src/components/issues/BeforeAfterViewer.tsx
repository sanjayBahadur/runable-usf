import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import type { IssueReport } from '@/src/types';

type BeforeAfterViewerProps = {
  issue: IssueReport;
};

export function BeforeAfterViewer({ issue }: BeforeAfterViewerProps) {
  function renderPhoto(uri: string | null | undefined, fallback: string) {
    if (!uri) return <ThemedText>{fallback}</ThemedText>;
    if (uri.startsWith('demo://')) return <ThemedText style={styles.demoText}>{uri}</ThemedText>;
    
    return (
      <View style={styles.imageWrap}>
        <Image source={{ uri }} style={styles.image} contentFit="contain" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <ThemedText type="defaultSemiBold">Before</ThemedText>
        {renderPhoto(issue.photoUri, 'No before photo')}
      </View>
      <View style={styles.block}>
        <ThemedText type="defaultSemiBold">After</ThemedText>
        {renderPhoto(issue.afterPhotoUri, 'No after photo yet')}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  block: {
    gap: 4,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
  },
  demoText: {
    color: '#64748B',
  },
  imageWrap: {
    height: 150,
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    marginTop: 4,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
