# Module 10 — Sightings & Landmarks

## Goal

Allow users to add positive campus observations:

```txt
wildlife
plants/trees
scenic spots
pond/lake
landmarks
other

These appear as map pins and feed items.

Files to Create
src/components/sightings/SightingForm.tsx
src/components/sightings/SightingCard.tsx
src/components/sightings/SightingCategoryPicker.tsx
src/components/sightings/LandmarkVoteCard.tsx
src/components/sightings/index.ts

src/features/sightings/createSighting.ts
src/features/sightings/index.ts

src/hooks/useSightings.ts
Categories
Animal
Plant/Tree
Scenic Spot
Pond/Lake
Landmark
Other
Required Behavior
1. user adds sighting with photo or mock image
2. user selects category
3. user adds optional label/note
4. sighting appears as blue/green pin
5. sighting appears in feed
6. landmark posts can have name suggestions/votes
Permission Rule

MVP:

Anyone can view sightings.
Owning group can add sightings inside owned cells.
In demo mode, allow creating sightings for current demo group.
Rules
Do not implement complex moderation.
Do not implement AI verification.
Use local/demo state first unless Supabase module already exists.
Keep UI minimal.
Do not block the app if photo picker fails.
Acceptance Criteria
Sightings render as map pins.
Sighting cards show category, label, note, and photo.
Landmark name voting works locally or with mock data.
Feed item can be created.
App still runs.






#Codex Prompt

Implement Module 10 only.

Follow docs/modules/10-sightings-landmarks.md.

Use local/demo state first.

Do not implement AI, final styling, or complex permissions.

After implementation:

summarize files created/changed
run available TypeScript/lint checks
explain how to add and view a sighting










