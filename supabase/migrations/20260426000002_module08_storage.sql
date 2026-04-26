insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/png', 'image/jpeg', 'image/webp']),
  ('issue-images', 'issue-images', true, 10485760, array['image/png', 'image/jpeg', 'image/webp']),
  ('sighting-images', 'sighting-images', true, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "public can read avatars"
on storage.objects for select
to public
using (bucket_id = 'avatars');

create policy "public can read issue images"
on storage.objects for select
to public
using (bucket_id = 'issue-images');

create policy "public can read sighting images"
on storage.objects for select
to public
using (bucket_id = 'sighting-images');

create policy "authenticated users can upload avatars to their folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "authenticated users can upload issue images to their folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'issue-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "authenticated users can upload sighting images to their folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'sighting-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "authenticated users can update their own avatar objects"
on storage.objects for update
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid())
with check (bucket_id = 'avatars' and owner = auth.uid());

create policy "authenticated users can update their own issue image objects"
on storage.objects for update
to authenticated
using (bucket_id = 'issue-images' and owner = auth.uid())
with check (bucket_id = 'issue-images' and owner = auth.uid());

create policy "authenticated users can update their own sighting image objects"
on storage.objects for update
to authenticated
using (bucket_id = 'sighting-images' and owner = auth.uid())
with check (bucket_id = 'sighting-images' and owner = auth.uid());

create policy "authenticated users can delete their own avatar objects"
on storage.objects for delete
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid());

create policy "authenticated users can delete their own issue image objects"
on storage.objects for delete
to authenticated
using (bucket_id = 'issue-images' and owner = auth.uid());

create policy "authenticated users can delete their own sighting image objects"
on storage.objects for delete
to authenticated
using (bucket_id = 'sighting-images' and owner = auth.uid());
