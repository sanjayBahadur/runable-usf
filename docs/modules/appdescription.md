# Runable — Feature Summary

## App Concept

Runable is a campus-only gamified running and stewardship app for USF Tampa.

Users run closed loops on campus to claim territory for their group, paint owned cells with pixel-art style customization, report/fix campus issues, document wildlife and landmarks, and compete on leaderboards.

Core slogan:

Claim. Clean. Customize. Care for your campus.

The app should feel like a retro campus pin-board operating system:
Windows XP / early internet UI + pixel-art campus board + modern Strava-like fitness utility.

---

## 1. Campus-Only Map Board

The app focuses only on the USF Tampa campus area.

The playable board is constrained by roads:

- North: E Fletcher Ave
- East: N 50th St
- South: E Fowler Ave
- West: N 56th St

The map is not meant to be a generic Google Maps experience. It should feel like a bounded campus game board.

Features:

- Full-screen campus map
- Road-bounded USF playable board
- Campus board frame/overlay
- Territory grid cells
- Group-colored owned cells
- Issue pins
- Sighting pins
- Run paths
- Pixel paint overlays
- Recenter-to-campus behavior
- Off-campus preview mode

---

## 2. Campus Access / Preview Mode

The app should detect whether the user is on campus.

If on campus:

- Live run tracking is enabled
- Territory claiming is enabled
- Issue reporting is enabled
- Sighting creation is enabled
- Pixel painting is enabled for owned cells

If off campus:

- App still opens
- Map still works
- Demo mode still works
- Feed/stats/group screens still work
- Live claiming is disabled
- App shows Preview Mode instead of fully blocking the user

Important rule:

Do not hard-block the app off campus. Only disable live claiming/run actions.

---

## 3. Groups

Users belong to groups.

Example groups:

- Eco Bulls
- Running Club
- Arts Club
- Engineering Runners
- Honors Herd
- Christ Club

Group features:

- Create group
- Join group
- Group name
- Group color
- Group points
- Member count
- Territory cells owned
- Issues reported
- Issues fixed
- Sightings added
- Painted cells
- Group leaderboard ranking

Groups are central because territory ownership belongs to groups, not just individuals.

---

## 4. Run Tracking

Users can start a campus run.

The app records:

- GPS path
- Distance
- Elapsed time
- Pace
- Start point
- End point
- Run status

Run statuses:

- idle
- running
- paused
- completed
- cancelled

Run flow:

1. User taps Start Run.
2. App records GPS path.
3. User finishes run.
4. App checks if the path forms a valid closed loop.
5. If valid, the loop becomes a territory claim.

For hackathon reliability, the app also includes Demo Mode with simulated runs.

---

## 5. Closed Loop Detection

A run can claim territory only if it forms a valid closed loop.

A valid loop requires:

- At least 8 GPS points
- At least 100 meters total path distance
- Final point within 25 meters of the starting point
- At least 400 square meters enclosed area
- Mostly inside the USF campus board/access boundary

Invalid loops should show a clear reason.

Examples of invalid reasons:

- Run too short
- Not enough GPS points
- End point too far from start
- Enclosed area too small
- Outside campus boundary

---

## 6. Territory Claiming

A valid closed loop becomes a claim polygon.

The app divides the USF campus board into grid cells.

For MVP:

- Use 10 meter cells
- Do not use 1 meter cells yet

When a claim is created:

1. The app finds all cells whose centers fall inside the claim polygon.
2. The user’s group earns claim score for those cells.
3. Each affected cell updates its group score.
4. The cell owner is recalculated.

Territory data includes:

- Claim ID
- User ID
- Group ID
- Path
- Polygon
- Distance
- Area
- Elapsed time
- Score
- Active period
- Created timestamp

---

## 7. Overlap / Layered Ownership System

Territory overlap is resolved at the grid-cell level.

Each cell can have scores from multiple groups.

The owner of a cell is:

The group with the highest score for that cell during the active period.

This creates Photoshop-like layering:

- Higher scoring group appears on top
- Lower scoring group remains underneath in score history
- Non-overlapped cells remain owned by the previous group

Example:

- Group A claims 50 cells
- Group B overlaps 20 of those cells and scores higher
- Group B owns the 20 overlapped cells
- Group A keeps the remaining 30 non-overlapped cells

This avoids complicated polygon cutting.

---

## 8. Claim Scoring

Claim score should reward:

- Valid loop completion
- Distance
- Enclosed area
- Effort/pace, capped to avoid scooter cheating

Example MVP formula:

- Base loop points
- Distance points
- Area points
- Capped pace bonus

Pace bonus must be capped so impossible speed does not dominate.

---

## 9. Pixel Art / Territory Painting

Groups can customize the cells they own.

The campus grid itself acts as the pixel canvas.

Rules:

- User can paint only cells owned by their group
- User selects a color
- User taps an owned cell
- Cell receives visible paint overlay
- If the group loses the cell, the art may become hidden or visually overridden

Paint features:

- Paint mode
- Color picker
- Painted cell count
- Paint action button
- Compact retro paint dialog
- Visible painted cells on the map

The paint UI should feel like a small retro MS Paint-style utility window.

---

## 10. Issue Reporting

Users can report real campus problems.

Categories:

- Litter
- Broken Infrastructure
- Pavement Damage
- Other

Issue reporting flow:

1. User taps Report Issue.
2. User takes or selects a photo.
3. User chooses category.
4. User optionally adds description.
5. Issue appears as a red pin on the map.

Issue data includes:

- Issue ID
- Reporter user ID
- Reporter group ID
- Coordinate
- Category
- Description
- Before photo
- Status
- Created timestamp

Important rule:

Anyone can report issues anywhere on campus. Issue reporting is not limited by territory ownership.

---

## 11. Issue Fixing

Users can fix open issues.

Issue fixing flow:

1. User taps red issue pin.
2. User views issue detail.
3. User adds an after photo.
4. User marks issue as fixed.
5. Pin turns green.
6. Fixer and fixer’s group earn points.
7. Feed event is created.

Issue states:

- open
- fixed

Point values:

- Reporting issue gives smaller points
- Fixing issue gives high points
- Fixing issue in rival territory can give bonus points

Important rule:

Anyone can fix issues anywhere. Campus care should not be blocked by group ownership.

---

## 12. Sightings and Landmarks

Users can document positive campus observations.

Categories:

- Animal
- Plant / Tree
- Scenic Spot
- Pond / Lake
- Landmark
- Other

Sighting flow:

1. User taps Add Sighting.
2. User takes/selects photo.
3. User chooses category.
4. User adds optional label/note.
5. Sighting appears as a blue/green pin on map.
6. Feed event is created.

Landmark features:

- Suggest landmark names
- Vote on landmark names
- Like sightings
- Comment later if feed supports it

Suggested rule:

Anyone can view sightings. Adding/featuring sightings inside owned territory can be limited to owning group later.

---

## 13. Feed

The feed makes the app feel alive.

Feed item types:

- run_completed
- territory_claimed
- issue_reported
- issue_fixed
- sighting_added
- landmark_named
- art_updated
- group_won_period

Feed variants:

- Campus Feed
- Group Feed
- Territory Feed
- Route/Run Feed later

MVP feed:

- Use demo/local data first
- Show recent events
- Support local likes
- Support comments later
- Show group-colored event cards

---

## 14. Leaderboards

Leaderboards support competition.

Leaderboard types:

- Top Groups
- Top Users
- Most Cells Owned
- Most Issues Fixed
- Most Sightings Added
- Most Distance Run
- Weekly Winner Preview

Leaderboard rows should show:

- Rank
- Name
- Group color/avatar
- Score/stat
- Highlight current user or group

---

## 15. Points System

Suggested point values:

- Run 100 meters: +5
- Valid loop bonus: +50
- Territory claim: area/cell based
- Report issue: +20
- Fix issue: +150
- Fix issue in rival territory: +200
- Add sighting: +25
- Paint cell: +10
- Defend territory: +75
- Steal territory: +125

Design principle:

Stewardship actions should be highly rewarded. Fixing real campus issues should matter more than only running loops.

---

## 16. Game Periods

The day is split into four periods:

- Dawn: 5 AM – 11 AM
- Day: 11 AM – 5 PM
- Dusk: 5 PM – 11 PM
- Night: 11 PM – 5 AM

During each period:

- Groups compete for cell ownership
- Cell scores accumulate
- Ownership is based on highest group score per cell

At period end:

- Ownership snapshot can be frozen
- Winner can be calculated

---

## 17. Daily / Weekly Archives

Archives preserve winning maps.

Archive features:

- Daily winner
- Weekly winner
- Winning group name
- Winning group color
- Total points
- Cells owned
- Issues fixed
- Sightings added
- Map snapshot
- Painted campus art snapshot

Purpose:

Weekly winners become immortalized in Runable history.

MVP can use manual “Finalize Week” button instead of scheduled backend jobs.

---

## 18. Demo Mode

Demo Mode is required for hackathon reliability.

Demo Mode includes:

- Mock groups
- Mock users
- Demo valid loop path
- Demo overlapping rival loop
- Demo territory cells
- Demo issue pins
- Demo fixed issue
- Demo sightings
- Demo painted cells
- Demo feed events
- Demo leaderboard

Demo Mode allows the full app story to work indoors without live GPS.

Demo scenario should show:

1. Group A claims territory
2. Group B overlaps and steals cells
3. Issue pin appears
4. Issue is fixed
5. Paint appears
6. Feed updates
7. Leaderboard updates

---

## 19. Supabase Backend

Supabase is used later after local demo works.

Backend services:

- Auth
- Profiles
- Groups
- Runs
- Claims
- Cell scores
- Cell ownership
- Cell art
- Issues
- Sightings
- Feed items
- Comments
- Likes
- Leaderboard snapshots
- Archived maps
- Photo storage

Important backend rule:

The app must still work in Demo Mode without Supabase environment variables.

---

## 20. Authentication and Onboarding

Auth is added after the local demo.

Features:

- Email/password signup
- Login
- Create profile
- Username
- Avatar later
- Create group
- Join group
- Group color assignment

Optional later:

- University email verification
- Google/Apple login

---

## 21. Photo Storage

Photo storage supports:

- Issue before photos
- Issue after photos
- Sighting photos
- Landmark photos
- Profile/group images later

Use Supabase Storage when backend is integrated.

Before Supabase, local/demo image URIs are acceptable.

---

## 22. Optional AI Photo Verification

Optional wow feature.

AI can help verify:

- Is this photo actually litter?
- Does the after photo look cleaned?
- Is this sighting category correct?
- Suggest issue category
- Suggest wildlife/landmark label

Important rule:

AI must never block submission completely. If AI fails, manual submission still works.

---

## 23. UI / Visual Theme

Hard aesthetic direction:

Retro campus pin-board operating system.

Inspired by:

- Windows 95 / Windows XP
- blue title bars
- gray/cream dialog windows
- retro buttons
- pixel-art web posters
- early internet/Y2K desktop collage
- modern Strava-like map utility

Theme rules:

- Map is the base world
- USF board is the game surface
- Panels look like retro utility windows
- Title bars are XP blue
- Card bodies are cream/light gray
- Text must be dark and readable
- Buttons are beveled/retro but touch-friendly
- Pixel styling is used as accent, not for long text
- UI must respect phone notches, status bars, and home indicators

Avoid:

- giant translucent panels
- low contrast text
- debug cards on main map
- full desktop simulation
- cluttered overlapping windows

---

## 24. Core Screens

### Map Screen

Main screen.

Features:

- USF campus board
- Territory cells
- Pins
- Paint mode
- Start/demo run
- Report issue
- Add sighting
- Compact legend
- Compact top status bar
- Bottom action dock

### Feed Screen

Shows:

- territory claimed
- issue reported/fixed
- sightings
- art updates
- group actions

### Group Screen

Shows:

- group name
- group color
- points
- cells owned
- members
- issues fixed
- recent group activity

### Stats Screen

Shows:

- distance run
- runs completed
- cells claimed
- issues fixed
- sightings added
- painted cells
- badges later

### Development Log / Demo Screen

Shows:

- module status
- debug controls
- demo seed/reset
- useful dev info

This should not cover the main map by default.

---

## 25. MVP Success Criteria

The MVP is successful if the demo can show:

1. App opens to USF Tampa campus board.
2. Board is constrained by Fletcher / 50th / Fowler / 56th.
3. Territory grid appears.
4. Demo loop claims cells.
5. Rival loop overlaps and steals cells.
6. Group colors appear.
7. User can paint owned cells.
8. User can report issue.
9. Red issue pin appears.
10. User can fix issue.
11. Pin turns green.
12. Points update.
13. Feed shows events.
14. Leaderboard shows rankings.
15. UI is readable and retro-themed.
16. App works in Expo Go.

---

## 26. One-Sentence Summary

Runable turns USF Tampa into a retro pixel-art fitness board where students run loops to claim territory, paint owned cells, report and fix campus issues, document sightings, and compete as groups to care for their campus.