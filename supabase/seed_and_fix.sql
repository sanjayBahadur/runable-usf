-- ============================================================
-- Runable USF — Post-Migration Setup & Demo Seed Data
-- Run this in the Supabase SQL Editor or via CLI
-- ============================================================

-- ── 1. Fix migration version tracking ──
-- The old filename used `20260426` which collided. Update to the
-- proper 14-digit format so `supabase db push` stays clean.
UPDATE supabase_migrations.schema_migrations
SET version = '20260426000001', name = '20260426000001_module08_base.sql'
WHERE version = '20260426';

-- ── 2. Apply storage buckets ──
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, array['image/png', 'image/jpeg', 'image/webp']),
  ('issue-images', 'issue-images', true, 10485760, array['image/png', 'image/jpeg', 'image/webp']),
  ('sighting-images', 'sighting-images', true, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ── 3. Storage RLS policies ──
DO $$ BEGIN
  -- Read policies
  CREATE POLICY "public can read avatars" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "public can read issue images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'issue-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "public can read sighting images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'sighting-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Upload policies
DO $$ BEGIN
  CREATE POLICY "authenticated users can upload avatars to their folder" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "authenticated users can upload issue images to their folder" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'issue-images' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "authenticated users can upload sighting images to their folder" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'sighting-images' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Update policies
DO $$ BEGIN
  CREATE POLICY "authenticated users can update their own avatar objects" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND owner = auth.uid()) WITH CHECK (bucket_id = 'avatars' AND owner = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "authenticated users can update their own issue image objects" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'issue-images' AND owner = auth.uid()) WITH CHECK (bucket_id = 'issue-images' AND owner = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "authenticated users can update their own sighting image objects" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'sighting-images' AND owner = auth.uid()) WITH CHECK (bucket_id = 'sighting-images' AND owner = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Delete policies
DO $$ BEGIN
  CREATE POLICY "authenticated users can delete their own avatar objects" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND owner = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "authenticated users can delete their own issue image objects" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'issue-images' AND owner = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "authenticated users can delete their own sighting image objects" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'sighting-images' AND owner = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── 4. Register storage migration as applied ──
INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
VALUES ('20260426000002', '20260426000002_module08_storage.sql', '{}')
ON CONFLICT DO NOTHING;

-- ── 5. Seed groups with decent demo data ──
INSERT INTO public.groups (name, slug, description, primary_color, accent_color, total_points)
VALUES
  (
    'USF Bulls',
    'bulls',
    'The original campus crew. Green and gold run through our veins. We claim the heart of campus and defend every cell.',
    '#006747',
    '#CFC493',
    2450
  ),
  (
    'Gold Herd',
    'gold-herd',
    'Speed is our strategy. We run fast, claim wide, and paint everything gold. The east side of campus belongs to us.',
    '#CFC493',
    '#006747',
    1820
  ),
  (
    'Campus Roamers',
    'roamers',
    'Explorers at heart. We find every hidden corner, report every issue, and spot every critter. Territory is secondary — stewardship is primary.',
    '#334155',
    '#F97316',
    1350
  ),
  (
    'Sunset Sprinters',
    'sunset-sprinters',
    'We come alive at golden hour. Our runs trace the most scenic routes on campus. If you see orange cells, you know we were here.',
    '#F97316',
    '#FACC15',
    980
  ),
  (
    'Bayou Bandits',
    'bayou-bandits',
    'Named after the campus waterways. We dominate the south end near the botanical gardens and the riverfront trails.',
    '#0EA5E9',
    '#064E3B',
    720
  )
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  total_points = EXCLUDED.total_points;

-- ── 6. Allow anon read on groups (for GroupPicker before login) ──
DO $$ BEGIN
  CREATE POLICY "groups are readable by everyone"
  ON public.groups FOR SELECT
  TO anon
  USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── 7. Disable email confirmation for hackathon speed ──
-- NOTE: This must be done manually in the Supabase dashboard:
--   Authentication → Settings → Uncheck "Enable email confirmations"
-- SQL cannot change auth config directly.

-- ============================================================
-- Done! Verify:
--   • 5 groups in Table Editor → groups
--   • 3 buckets in Storage
--   • No migration version conflicts
-- ============================================================
