# Module 12 — Optional AI Photo Verification

## Goal

Add optional AI verification for issue and sighting photos.

This is a wow-factor module and should only be implemented after the core demo works.

AI should help with:

```txt
checking if issue photo matches selected category
checking if after-photo looks cleaner
suggesting issue category
suggesting wildlife/sighting label
Files to Create
src/lib/ai/photoVerification.ts
src/lib/ai/prompts.ts
src/lib/ai/index.ts

src/components/ai/VerificationBadge.tsx
src/components/ai/VerificationWarning.tsx
src/components/ai/index.ts
Required Type
export type PhotoVerificationResult = {
  isValid: boolean;
  confidence: number;
  suggestedCategory?: string;
  explanation: string;
};
Required Behavior
1. accept image URL or local image URI
2. accept selected category
3. return verification result
4. show verified/uncertain/manual-review badge
5. never block submission completely
Fallback Behavior

If no API key is configured:

return a safe mock result
allow manual submission
show "manual review" state
Rules
Do not block reporting/fixing if AI fails.
Do not require AI for MVP.
Do not hardcode API keys.
Keep AI service isolated.
Do not add backend complexity unless necessary.
Acceptance Criteria
Verification service returns a typed result.
UI badge can show verified/uncertain/manual-review.
App works without API key.
Issue and sighting flows still work if AI fails.







#Codex Prompt

Implement Module 12 only if the core app already works.

Follow docs/modules/12-ai-photo-verification.md.

Do not block issue reporting or sighting creation if AI fails.

Do not hardcode API keys.

After implementation:

summarize files created/changed
explain how fallback mode works
explain where API integration can be added later




