# Module 06 — Issues: Reporting & Fixing

## Goal

Build the campus issue reporting and fixing system.

This is Runable’s hero stewardship feature.

Users can:

```txt
- report an issue with a photo
- choose category
- add description
- place issue at current/demo coordinate
- see red issue pin
- fix issue with after photo
- turn pin green
- award points
Files to Create
src/components/issues/IssueForm.tsx
src/components/issues/IssueCategoryPicker.tsx
src/components/issues/IssueCard.tsx
src/components/issues/IssuePin.tsx
src/components/issues/FixIssueForm.tsx
src/components/issues/BeforeAfterViewer.tsx
src/components/issues/index.ts

src/features/issues/createIssueReport.ts
src/features/issues/fixIssue.ts
src/features/issues/index.ts

src/hooks/useIssueReports.ts
Issue Categories
Litter
Broken Infrastructure
Pavement Damage
Other
Required Behavior
Reporting
1. user taps Report Issue
2. user selects/takes photo
3. user selects category
4. user adds optional description
5. issue is created
6. red pin appears on map
Fixing
1. user taps open issue
2. user adds after photo
3. user marks fixed
4. issue status changes to fixed
5. pin turns green
6. fixer group receives points
MVP Storage

For this module, use local/demo state first.

Do not require Supabase yet.

Photo handling can use Expo Image Picker, but if integration is not ready, allow mock image URI fallback.

Rules
Anyone can report issues.
Anyone can fix issues.
Fixing gives high points.
Fixing in rival territory can give bonus later.
Do not block issue reporting based on territory ownership.
Do not implement AI verification yet.
Do not connect Supabase yet unless explicitly requested.
Keep UI minimal.
Acceptance Criteria
Open issues show as red pins.
Fixed issues show as green pins.
Issue card shows category, description, photo, and status.
Fix flow supports before/after display.
Points can be calculated or returned after fixing.
App still runs.






#Codex Prompt

Implement Module 06 only.

Follow docs/modules/06-issues.md.

Use local/demo state first.

Do not implement Supabase, auth, AI verification, feed comments, or final styling.

After implementation:

summarize files created/changed
run available TypeScript/lint checks
explain how to report and fix an issue in the demo