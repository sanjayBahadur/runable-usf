# Module 08 — Supabase & Auth Integration

## Goal

Connect Runable to Supabase after the local demo works.

This module adds:

```txt
Supabase client
Auth
Profiles
Groups
Storage uploads
Basic database services

Do this only after Modules 00–07 work locally.

Files to Create
src/lib/supabase/client.ts
src/lib/supabase/authService.ts
src/lib/supabase/userService.ts
src/lib/supabase/groupService.ts
src/lib/supabase/runService.ts
src/lib/supabase/territoryService.ts
src/lib/supabase/issueService.ts
src/lib/supabase/sightingService.ts
src/lib/supabase/feedService.ts
src/lib/supabase/artService.ts
src/lib/supabase/storageService.ts
src/lib/supabase/index.ts

src/hooks/useAuth.ts

src/components/auth/LoginForm.tsx
src/components/auth/SignupForm.tsx
src/components/auth/OnboardingForm.tsx
src/components/auth/GroupPicker.tsx
src/components/auth/index.ts
Environment Variables

Use Expo public environment variables:

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

Do not hardcode secrets.

Required Services
Auth
signUpWithEmail(email, password)
signInWithEmail(email, password)
signOut()
getCurrentUser()
Profiles
createUserProfile(profile)
getUserProfile(userId)
updateUserProfile(userId, updates)
Groups
createGroup(group)
getGroups()
joinGroup(userId, groupId)
updateGroupPoints(groupId, delta)
Storage
uploadImageAsync(uri, bucketPath)
Issues
createIssue(issue)
updateIssue(issueId, updates)
getIssues()
Sightings
createSighting(sighting)
getSightings()
Art
saveCellArt(cellArt)
getCellArt()
Rules
Do not break demo mode.
Demo mode should still work without Supabase.
Keep services separate from UI.
Do not put Supabase calls inside geometry or territory engines.
Do not hardcode Supabase keys.
Do not implement complex realtime yet.
Do not overbuild auth screens.
Acceptance Criteria
App can run without Supabase env vars in demo mode.
Supabase client initializes when env vars exist.
User can sign up/login.
User can create or join group.
Images can upload to storage.
Issues/sightings can be saved.
Existing local demo still works.



#Codex Prompt

Implement Module 08 only after Modules 00–07 work.

Follow docs/modules/08-supabase-auth.md.

Do not rewrite geometry, territory, map, pixel art, issues, feed, or leaderboard logic.

Keep Supabase isolated in service files.

After implementation:

summarize files created/changed
list required Supabase tables/buckets
explain how to run in demo mode without Supabase
explain how to run with Supabase enabled