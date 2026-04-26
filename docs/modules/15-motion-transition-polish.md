













# Module 15 — Motion & Transition Polish

## Goal

Add lightweight motion polish to make Runable feel alive.

This module should be implemented only after the core demo and app shell are stable.

Motion should support the product, not distract from it.

## Design Direction

Runable should feel like a modern campus game board with nostalgic interface energy.

Animations should be:

- small
- quick
- readable
- satisfying
- optional where possible

## Motion Concepts

Use motion for:

```txt
territory claim feedback
cell ownership changes
issue fixed celebration
bottom sheet/card transitions
button press feedback
feed item appearance
campus recenter action

Do not use motion for:

core navigation that becomes hard to understand
complex pinch-based page transitions
slow decorative animations
large distracting effects
Files to Create or Update
src/lib/motion/timings.ts
src/lib/motion/easing.ts
src/lib/motion/index.ts

src/components/motion/FadeIn.tsx
src/components/motion/SlideUpPanel.tsx
src/components/motion/PulseCell.tsx
src/components/motion/ClaimCelebration.tsx
src/components/motion/index.ts

src/components/map/TerritoryCellLayer.tsx
src/components/issues/FixedIssueBadge.tsx
src/components/feed/FeedItemCard.tsx
Recommended Library

Use React Native built-in Animated first.

Only add Reanimated if already installed or explicitly approved.

For MVP, avoid adding heavy animation dependencies.

Required Animations
Territory Claim Pulse

When a new claim appears:

affected cells briefly pulse or brighten
Issue Fixed Feedback

When issue is fixed:

red pin changes to green
small success badge appears
Panel Slide

Map detail cards should slide up from bottom.

Feed Item Fade

New feed items can fade in.

Button Press

Primary buttons should have subtle press scale/opacity.

Performance Rules
Animations must not slow map interaction.
Do not animate thousands of cells individually.
Animate only recently changed cells or overlay groups.
Keep durations short: 120ms–350ms.
Avoid infinite animations except subtle active-run pulse.
UX Rules
Motion must never hide important information.
Motion should be skippable by simply waiting.
No complex pinch-to-transform navigation in MVP.
Keep navigation obvious with buttons/tabs.
Acceptance Criteria
New territory claims have visible feedback.
Fixed issue action feels rewarding.
Panels/cards transition smoothly.
App remains responsive.
No major dependency bloat.
Existing functionality remains unchanged.
Codex Prompt

Implement Module 15 only after Module 14 is stable.

Read AGENTS.md and docs/modules/15-motion-transition-polish.md.

Add lightweight animations using React Native Animated unless another animation library already exists.

Do not rewrite app architecture.
Do not add heavy dependencies unless necessary.
Do not implement complex pinch navigation.

After implementation:

summarize files created
summarize files modified
explain what animations were added
explain how to test them
run available TypeScript/lint checks