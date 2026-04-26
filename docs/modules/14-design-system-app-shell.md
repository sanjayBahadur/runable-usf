# Module 14 — Design System & App Shell

## Goal

Create a minimal but polished visual system for Runable.

The target aesthetic is:

> Windows XP Luna + Stardew Valley coziness + modern Strava-like mobile clarity.

This module should make the app feel intentional without over-styling unfinished features.

## Design Thesis

Runable is a campus operating system for movement and stewardship.

The map is the desktop.
Territory cells are pixels.
Issues are system alerts.
Sightings are discoveries.
Groups are user accounts.
Feed is the activity log.

The app should feel playful, clean, and modern.

## Inspiration

Use Windows XP-inspired elements:

- blue title bars
- rounded window panels
- soft gradients
- cream window bodies
- small system-style chips
- progress bars
- friendly alert dialogs

Use Stardew-inspired elements:

- cozy pixel accents
- nature-forward colors
- collectible/discovery feeling
- warm reward messages
- simple icons

Use Strava-inspired structure:

- map-first experience
- clear fitness stats
- activity feed cards
- leaderboards
- strong action button hierarchy

## Files to Create or Update

```txt
src/constants/theme.ts

src/components/ui/XPWindow.tsx
src/components/ui/XPTitleBar.tsx
src/components/ui/PixelChip.tsx
src/components/ui/GlossyButton.tsx
src/components/ui/StatTile.tsx
src/components/ui/ActionDock.tsx
src/components/ui/RunableCard.tsx
src/components/ui/index.ts

src/components/layout/AppShell.tsx
src/components/layout/MapOverlayShell.tsx
src/components/layout/BottomNav.tsx
src/components/layout/index.ts

app/_layout.tsx
app/index.tsx
Theme Tokens

Create tokens for:

colors
spacing
radii
shadows
fontSizes
zIndex

Recommended colors:

USF Green:        #006747
XP Blue:          #245EDC
XP Sky:           #5BA8FF
XP Grass:         #7AC943
Gold Accent:      #CFC493
Cream Window:     #F4F1D7
Deep Navy:        #0B1020
Panel Black:      rgba(8, 13, 24, 0.78)
Issue Red:        #E53935
Fixed Green:      #20B15A
Sighting Cyan:    #15AEEA
Required Components
XPWindow

A reusable card/window component.

Used for:

territory details
issue details
run summary
status panels
achievement messages

Should support:

title
children
variant: light | dark | glass
XPTitleBar

A small Windows-XP-inspired title bar.

Should support:

title
optional icon
optional close/action buttons
PixelChip

Small chip for:

group label
status label
score tag
campus mode
GlossyButton

Primary button style for:

Start Run
Report Issue
Fix Issue
Paint
StatTile

Small stat display for:

distance
points
cells owned
issues fixed
ActionDock

Floating map action dock.

Should include slots for:

Start Run
Report
Sighting
Paint
BottomNav

Minimal bottom navigation:

Map
Group
Feed
Stats
UX Rules
The map remains the main visual focus.
Overlays should not cover too much of the map.
Debug module cards should not appear in product mode.
Use compact cards and expandable panels.
Keep controls thumb-friendly.
Use readable contrast.
Avoid tiny pixel fonts for body text.
Use pixel styling as accent, not as the entire interface.
What Not To Do

Do not:

install novelty fonts yet
redesign all screens completely
add complex animations
create a fake desktop UI that is hard to use on mobile
replace working gameplay logic
change geometry or territory engine
add Supabase/auth
add AI
Acceptance Criteria
App has reusable UI primitives.
Map screen has a cleaner overlay shell.
Bottom navigation feels intentional.
Start Run / Report / Sighting / Paint actions are visually clear.
Existing map/demo still works.
UI feels more Runable-specific without final polish.
No core logic is rewritten.
Codex Prompt

Implement Module 14 only.

Read AGENTS.md and docs/modules/14-design-system-app-shell.md.

Create reusable UI primitives and a cleaner app shell inspired by Windows XP Luna, Stardew Valley coziness, and modern Strava-like clarity.

Do not modify geometry, territory scoring, demo data, Supabase, auth, or issue logic except to connect existing components into the new shell.

Keep styling minimal and extensible.

After implementation:

summarize files created
summarize files modified
explain how to test the app shell
run available TypeScript/lint checks
