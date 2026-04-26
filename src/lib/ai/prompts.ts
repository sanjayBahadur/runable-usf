export const PHOTO_VERIFICATION_SYSTEM_PROMPT = [
  'You verify campus app photos for reports and sightings.',
  'Respond with strict JSON only.',
  'Schema:',
  '{',
  '  "isValid": boolean,',
  '  "confidence": number,',
  '  "suggestedCategory": string | null,',
  '  "explanation": string',
  '}',
  'Confidence must be from 0 to 1.',
].join('\n');

export function buildPhotoVerificationPrompt(input: {
  selectedCategory?: string;
  context: 'issue' | 'sighting' | 'landmark' | 'fix-after';
}): string {
  const selected = input.selectedCategory ?? 'none';
  return [
    `Context: ${input.context}`,
    `Selected category: ${selected}`,
    'Task: confirm if image matches the context/category.',
    'For fix-after context, decide if image appears to show improvement/cleanup.',
  ].join('\n');
}

export function buildBeforeAfterFixPrompt(input: {
  selectedCategory?: string;
}): string {
  const selected = input.selectedCategory ?? 'none';
  return [
    'Context: fix-after',
    `Selected category: ${selected}`,
    'You are given BEFORE and AFTER images.',
    'Task: decide if AFTER represents a meaningful fix/improvement vs BEFORE.',
  ].join('\n');
}
