# Module 07 — Leaderboards & Feed

## Goal

Create simple leaderboards and a basic activity feed.

This module makes the app feel alive.

The feed should show events like:

```txt
run completed
territory claimed
issue reported
issue fixed
sighting added
cell painted

Leaderboards should show:

top groups
top users
most issues fixed
most cells owned
most sightings added
Files to Create
src/components/feed/FeedItemCard.tsx
src/components/feed/FeedTabs.tsx
src/components/feed/LikeButton.tsx
src/components/feed/CommentList.tsx
src/components/feed/CommentInput.tsx
src/components/feed/index.ts

src/components/leaderboard/LeaderboardTabs.tsx
src/components/leaderboard/LeaderboardRow.tsx
src/components/leaderboard/GroupLeaderboard.tsx
src/components/leaderboard/UserLeaderboard.tsx
src/components/leaderboard/index.ts

src/lib/feed/feedEvents.ts
src/lib/feed/feedVisibility.ts
src/lib/feed/index.ts

src/lib/leaderboard/ranking.ts
src/lib/leaderboard/index.ts
Required Feed Item Types
run_completed
territory_claimed
issue_reported
issue_fixed
sighting_added
landmark_named
art_updated
Required Leaderboards
Top Groups
Top Users
Most Issues Fixed
Most Cells Owned
Most Sightings Added
Rules
Use mock/demo data first.
Do not connect Supabase yet.
Do not implement real-time updates yet.
Likes/comments can be local only.
Keep UI minimal.
Do not build complex social media features.
Do not implement route-specific access rules yet unless simple.
Acceptance Criteria
Feed screen shows demo events.
Feed items can be liked locally.
Comments can be shown locally or mocked.
Leaderboard ranks groups/users.
Current/demo group can be highlighted.
App still runs.






#Codex Prompt

Implement Module 07 only.

Follow docs/modules/07-leaderboards-feed.md.

Use demo/local data first.

Do not implement Supabase, auth, realtime, AI, or final styling.

After implementation:

summarize files created/changed
run available TypeScript/lint checks
explain how to view feed and leaderboards