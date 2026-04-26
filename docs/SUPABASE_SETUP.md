# Supabase Setup

This project still runs in demo mode without Supabase.

Module 08 requires these pieces:

- database schema migrations
- storage buckets
- auth enabled in Supabase
- Expo public env vars for the client

## Keys You Need

You need these values from the Supabase project settings:

- `EXPO_PUBLIC_SUPABASE_URL`
  - Source: `Project Settings -> API -> Project URL`
  - Safe to expose to the Expo client.

- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  - Source: `Project Settings -> API -> anon public key`
  - Safe to expose to the Expo client.

Optional but commonly needed during setup:

- `SUPABASE_SERVICE_ROLE_KEY`
  - Source: `Project Settings -> API -> service_role secret key`
  - Do not put this in Expo public env vars.
  - Use it only for server-side scripts, admin tasks, Edge Functions, or CI.

- `SUPABASE_PROJECT_REF`
  - Source: the project reference in the Supabase dashboard URL or project settings.
  - Used by the Supabase CLI when linking the local repo to the hosted project.

You may also need:

- `SUPABASE_ACCESS_TOKEN`
  - Generated from your Supabase account for CLI use in CI or headless environments.
  - Not used by the app itself.

## Files Added For Module 08 Foundation

- `.env.example`
- `supabase/migrations/20260426_000001_module08_base.sql`
- `supabase/migrations/20260426_000002_module08_storage.sql`

## What The Migrations Create

Database tables:

- `groups`
- `profiles`
- `group_memberships`
- `runs`
- `territory_claims`
- `cell_scores`
- `cell_ownership`
- `issues`
- `sightings`
- `cell_art`
- `feed_items`

Storage buckets:

- `avatars`
- `issue-images`
- `sighting-images`

Other database setup:

- enum types for runs, issues, sightings, and feed items
- `handle_new_user()` trigger to create a profile row after signup
- `sync_group_member_count()` trigger for `group_memberships`
- `updated_at` trigger support
- row level security policies for MVP

## What You Need To Do

### 1. Create a Supabase project

In the Supabase dashboard:

1. Create a new project.
2. Choose a strong database password.
3. Wait for provisioning to finish.

### 2. Add local env vars

Create a local `.env` file in the repo root:

```bash
cp .env.example .env
```

Fill in:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_PROJECT_REF=YOUR_PROJECT_REF
```

Important:

- Only `EXPO_PUBLIC_*` variables are meant for the Expo app bundle.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in app code or public env vars.

### 3. Install and log into the Supabase CLI

If you do not already have the CLI:

```bash
npx supabase --version
```

If that does not work, install it by whichever method you prefer, then:

```bash
npx supabase login
```

### 4. Initialize the local Supabase folder if needed

If the CLI complains about missing config:

```bash
npx supabase init
```

This repo already has the `supabase/migrations` folder, so do not overwrite the migration files.

### 5. Link the repo to your project

```bash
npx supabase link --project-ref lpnwlxojlwgauzrbexgb
```

You will be prompted for the database password from project creation.

### 6. Push the migrations

Apply the SQL to your hosted project:

```bash
npx supabase db push
```

If you want to inspect remote status first:

```bash
npx supabase migration list
```

### 7. Configure Auth

In the Supabase dashboard:

1. Go to `Authentication -> Providers`.
2. Enable `Email`.
3. Decide whether email confirmation is required for MVP.

Recommended MVP choice:

- enable email/password
- disable mandatory email confirmation until flows are stable

### 8. Configure redirect URLs if you later add deep-link auth

Because the Expo app uses the `runable` scheme, if you later add magic links or OAuth, you will need redirect URLs. For now, plain email/password auth does not require the full redirect setup.

### 9. Verify storage buckets

After `db push`, confirm in the dashboard that these buckets exist:

- `avatars`
- `issue-images`
- `sighting-images`

## Current Security Notes

The migrations use MVP-friendly policies so development can move forward.

That means:

- read access is broadly allowed to authenticated users
- some territory and issue update policies are intentionally permissive for now

Before production, tighten:

- who can mutate `cell_scores` and `cell_ownership`
- who can update `groups.total_points`
- who can update issue fix state
- which service writes `feed_items`

## Mapping Between App Models And Tables

- `UserProfile` -> `profiles`
- `Group` -> `groups`
- `RunSession` -> `runs`
- territory claim output -> `territory_claims`
- `IssueReport` -> `issues`
- `Sighting` -> `sightings`
- `CellArt` -> `cell_art`
- `FeedItem` -> `feed_items`

Coordinates are stored as numeric latitude/longitude columns for issues and sightings, and as `jsonb` arrays for run paths and claim boundaries.

## What Is Still Not Implemented

This setup does not yet finish the full Module 08 client integration.

Still to build in app code:

- `@supabase/supabase-js` client setup
- auth services
- profile/group services
- storage upload service
- hooks and auth UI screens from `docs/modules/08-supabase-auth.md`

## Safe Next Steps

After you apply the migrations successfully, the next implementation step is:

1. install `@supabase/supabase-js`
2. add `src/lib/supabase/client.ts`
3. add auth and service wrappers
4. keep demo mode as fallback when env vars are missing
