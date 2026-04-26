import { supabase } from '@/src/lib/supabase/client';

/**
 * Upload an image from a local URI to a Supabase Storage bucket.
 * Returns the public URL on success, or null on failure.
 */
export async function uploadImage(
  localUri: string,
  bucket: 'avatars' | 'issue-images' | 'sighting-images',
  storagePath: string,
): Promise<string | null> {
  if (!supabase) return null;

  try {
    const response = await fetch(localUri);
    const blob = await response.blob();

    const { error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, blob, {
        contentType: blob.type || 'image/jpeg',
        upsert: true,
      });

    if (error) return null;

    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    return data.publicUrl;
  } catch {
    return null;
  }
}
