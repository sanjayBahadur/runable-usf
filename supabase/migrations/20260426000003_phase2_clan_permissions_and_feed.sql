-- Phase 2: clan permissions, scoped feed, and tile customization metadata

-- 1) Role metadata for group memberships and profile convenience
ALTER TABLE IF EXISTS public.group_memberships
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'member'
  CHECK (role IN ('member', 'executive'));

ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS group_role text DEFAULT 'member'
  CHECK (group_role IN ('member', 'executive'));

-- 2) Scoped feed visibility for global vs clan feeds
ALTER TABLE IF EXISTS public.feed_items
  ADD COLUMN IF NOT EXISTS visibility_scope text NOT NULL DEFAULT 'global'
  CHECK (visibility_scope IN ('global', 'group'));

ALTER TABLE IF EXISTS public.feed_items
  ADD COLUMN IF NOT EXISTS target_group_id uuid NULL REFERENCES public.groups(id) ON DELETE SET NULL;

-- 3) Tile customization metadata (left/right card variants etc.)
ALTER TABLE IF EXISTS public.cell_art
  ADD COLUMN IF NOT EXISTS left_card text NULL;

ALTER TABLE IF EXISTS public.cell_art
  ADD COLUMN IF NOT EXISTS right_card text NULL;

ALTER TABLE IF EXISTS public.cell_art
  ADD COLUMN IF NOT EXISTS pattern_id text NULL;

-- 4) Helper to identify executives for policy checks
CREATE OR REPLACE FUNCTION public.is_group_executive(check_user_id uuid, check_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_memberships gm
    WHERE gm.user_id = check_user_id
      AND gm.group_id = check_group_id
      AND gm.role = 'executive'
  );
$$;

-- 5) Basic RLS policy for clan feed reads
DO $$
BEGIN
  CREATE POLICY "authenticated can read scoped feed"
  ON public.feed_items
  FOR SELECT
  TO authenticated
  USING (
    visibility_scope = 'global'
    OR (
      visibility_scope = 'group'
      AND target_group_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.group_memberships gm
        WHERE gm.user_id = auth.uid()
          AND gm.group_id = target_group_id
      )
    )
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 6) Basic RLS policy for art updates by executives
DO $$
BEGIN
  CREATE POLICY "executives can customize owned clan tiles"
  ON public.cell_art
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_group_executive(auth.uid(), group_id)
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "executives can update owned clan tiles"
  ON public.cell_art
  FOR UPDATE
  TO authenticated
  USING (
    public.is_group_executive(auth.uid(), group_id)
  )
  WITH CHECK (
    public.is_group_executive(auth.uid(), group_id)
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
