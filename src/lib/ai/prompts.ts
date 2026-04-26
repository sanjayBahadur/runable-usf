export const PHOTO_VERIFICATION_SYSTEM_PROMPT = [
  'You verify campus app photos for reports and sightings.',
  'Your goal is to determine if the details in the payload match the provided image strictly and meticulously.',
  'Respond with strict JSON only.',
  'Schema:',
  '{',
  '  "isValid": boolean,',
  '  "confidence": number,',
  '  "suggestedCategory": string | null,',
  '  "explanation": string',
  '}',
  'Confidence must be from 0 to 1.',
  'Provide a thorough explanation.'
].join('\n');

export function buildPhotoVerificationPrompt(input: {
  selectedCategory?: string;
  context: 'issue' | 'sighting' | 'landmark' | 'fix-after';
  title?: string;
  description?: string;
  otherContext?: string;
}): string {
  const isOther = input.selectedCategory?.toLowerCase() === 'other' && input.otherContext;
  return [
    'Please analyze the image against the following payload to see if the subject corresponds to the details provided.',
    '```json',
    JSON.stringify({
      context: input.context,
      category: input.selectedCategory ?? 'none',
      customOtherCategoryDefinition: input.otherContext ?? null,
      title: input.title ?? '',
      description: input.description ?? ''
    }, null, 2),
    '```',
    isOther ? `IMPORTANT: The user selected 'Other' for the category and specifically defined it as: "${input.otherContext}". You MUST use this custom description to evaluate what the image is supposed to be.` : '',
    'Task: confirm if the image matches the context/category and the provided description strictly.'
  ].filter(Boolean).join('\n');
}

export function buildBeforeAfterFixPrompt(input: {
  selectedCategory?: string;
  originalTitle?: string;
  originalDescription?: string;
  fixDescription?: string;
}): string {
  return [
    'You are given BEFORE and AFTER images concerning a reported issue fix.',
    'Below is the original issue payload and the user\'s fix description:',
    '```json',
    JSON.stringify({
      context: 'fix-after',
      category: input.selectedCategory ?? 'none',
      originalTitle: input.originalTitle ?? '',
      originalDescription: input.originalDescription ?? '',
      fixDescription: input.fixDescription ?? ''
    }, null, 2),
    '```',
    'Task: Meticulously scan the BEFORE and AFTER images. Compare them to the previous issue payload. Decide if AFTER represents a meaningful fix/improvement vs BEFORE that actually aligns with the fixDescription.'
  ].join('\n');
}

export function buildFalseCompletionPrompt(input: {
  selectedCategory?: string;
  originalTitle?: string;
  originalDescription?: string;
  fixDescription?: string;
  falseCompletionDescription: string;
}): string {
  return [
    'You are given BEFORE and AFTER images of a reported issue fix that has been marked as a FALSE COMPLETION by a reviewer.',
    'Here is the payload data including the reporter\'s reasoning for the false completion:',
    '```json',
    JSON.stringify({
      category: input.selectedCategory ?? 'none',
      originalTitle: input.originalTitle ?? '',
      originalDescription: input.originalDescription ?? '',
      fixDescription: input.fixDescription ?? '',
      falseCompletionReasoning: input.falseCompletionDescription
    }, null, 2),
    '```',
    'Task: Evaluate the BEFORE/AFTER images against the false completion reasoning. Decide if the reviewer is correct that the issue was NOT properly fixed. If you agree it is a false completion, set isValid: false. Otherwise, set isValid: true (meaning the completion was actually fine).'
  ].join('\n');
}
