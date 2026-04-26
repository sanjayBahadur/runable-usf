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
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return null;

    const response = await fetch(localUri);
    const blob = await response.blob();
    const finalPath = `${userId}/${storagePath}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(finalPath, blob, {
        contentType: blob.type || 'image/jpeg',
        upsert: true,
      });

    if (error) return null;

    const { data } = supabase.storage.from(bucket).getPublicUrl(finalPath);
    return data.publicUrl;
  } catch {
    return null;
  }
}
