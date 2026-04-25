# Module 04 — Map Rendering

## Goal

Render Runable’s core game board using `react-native-maps`.

The map should display:

```txt
- campus boundary
- territory cells
- group ownership colors
- demo run paths
- issue pins
- sighting pins

This module should be prop-driven. It should display data, not calculate game logic.

Files to Create
src/components/map/CampusMap.tsx
src/components/map/CampusBoundaryLayer.tsx
src/components/map/RunPathLayer.tsx
src/components/map/TerritoryCellLayer.tsx
src/components/map/IssuePinLayer.tsx
src/components/map/SightingPinLayer.tsx
src/components/map/UserLocationMarker.tsx
src/components/map/MapLegend.tsx
src/components/map/index.ts
Main Component Contract

Create:

<CampusMap
  userLocation={userLocation}
  runPath={runPath}
  cells={cells}
  ownership={ownership}
  issues={issues}
  sightings={sightings}
  groups={groups}
  onCellPress={handleCellPress}
  onIssuePress={handleIssuePress}
  onSightingPress={handleSightingPress}
/>
Initial Screen

Use the demo scenario from Module 03 to render the first working map.

If using Expo Router, update the main app/index.tsx or relevant map screen to show the demo map.

Visual Rules

Keep styling minimal for now.

Use simple colors:

campus boundary = translucent green
Group A cells = group color with opacity
Group B cells = group color with opacity
open issue = red marker
fixed issue = green marker
sighting = blue/green marker
run path = bright line
Rules
Use react-native-maps.
Do not use Mapbox.
Do not use MapLibre.
Do not implement GPS tracking.
Do not implement Supabase.
Do not calculate ownership inside map components.
Map components should receive data through props.
Keep UI clean but minimal.
Avoid final styling polish for now.
Acceptance Criteria
App opens to a working map.
Campus boundary renders.
Territory cells render in group colors.
Overlapping claims show correct ownership.
Issue pins render.
Sighting pins render.
Demo run paths render.
Map remains responsive.




#Codex Prompt

Implement Module 04 only.

Follow docs/modules/04-map-rendering.md.

Use demo data from Module 03.

Do not implement real GPS, Supabase, auth, issue forms, pixel art, feed, or leaderboards.

After implementation:

summarize files created/changed
run available TypeScript/lint checks
tell me how to open and test the map