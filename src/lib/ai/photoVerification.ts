import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';

import type { PhotoVerificationResult } from '@/src/types';
import {
  buildBeforeAfterFixPrompt,
  buildPhotoVerificationPrompt,
  buildFalseCompletionPrompt,
  PHOTO_VERIFICATION_SYSTEM_PROMPT,
} from '@/src/lib/ai/prompts';

const GEMINI_MODEL = 'gemini-2.5-flash';

function getGeminiApiKey(): string {
  return (
    Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY ??
    process.env.EXPO_PUBLIC_GEMINI_API_KEY ??
    ''
  );
}

function safeManualReview(explanation: string): PhotoVerificationResult {
  return {
    isValid: true,
    confidence: 0,
    explanation,
    status: 'manual-review',
  };
}

function clampConfidence(value: unknown): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function deriveStatus(isValid: boolean, confidence: number): PhotoVerificationResult['status'] {
  if (confidence < 0.45) return 'manual-review';
  if (!isValid || confidence < 0.75) return 'uncertain';
  return 'verified';
}

function decodeJsonResponse(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();
  const jsonStart = trimmed.indexOf('{');
  const jsonEnd = trimmed.lastIndexOf('}');
  if (jsonStart < 0 || jsonEnd < 0 || jsonEnd <= jsonStart) return null;
  try {
    return JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function buildImagePart(uri: string): Promise<{ inlineData: { mimeType: string; data: string } } | null> {
  if (uri.startsWith('demo://')) return null;
  try {
    let data: string;
    let mimeType = 'image/jpeg';
    if (uri.toLowerCase().endsWith('.png')) mimeType = 'image/png';
    else if (uri.toLowerCase().endsWith('.webp')) mimeType = 'image/webp';

    if (uri.startsWith('http')) {
      const tempPath = FileSystem.cacheDirectory + 'temp_image_' + Date.now() + '.jpg';
      const downloaded = await FileSystem.downloadAsync(uri, tempPath);
      data = await FileSystem.readAsStringAsync(downloaded.uri, { encoding: FileSystem.EncodingType.Base64 });
      await FileSystem.deleteAsync(downloaded.uri, { idempotent: true });
    } else {
      data = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    }

    if (!data) return null;
    return {
      inlineData: {
        mimeType,
        data,
      },
    };
  } catch (err) {
    console.error("AI image generation error:", err);
    return null;
  }
}

async function callGemini(parts: Record<string, unknown>[]): Promise<PhotoVerificationResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return safeManualReview('No Gemini API key configured. Marked for manual review.');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: PHOTO_VERIFICATION_SYSTEM_PROMPT }],
        },
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      }),
    },
  );

  if (!response.ok) {
    return safeManualReview(`Gemini request failed (${response.status}). Marked for manual review.`);
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const parsed = decodeJsonResponse(text);

  if (!parsed) {
    return safeManualReview('AI response was not parseable. Marked for manual review.');
  }

  const isValid = Boolean(parsed.isValid);
  const confidence = clampConfidence(parsed.confidence);
  const suggestedCategory =
    typeof parsed.suggestedCategory === 'string' && parsed.suggestedCategory.length > 0
      ? parsed.suggestedCategory
      : undefined;
  const explanation =
    typeof parsed.explanation === 'string' && parsed.explanation.length > 0
      ? parsed.explanation
      : 'AI verification completed.';

  return {
    isValid,
    confidence,
    suggestedCategory,
    explanation,
    status: deriveStatus(isValid, confidence),
  };
}

export async function verifyPhoto(input: {
  imageUri: string;
  selectedCategory?: string;
  context: 'issue' | 'sighting' | 'landmark' | 'fix-after';
  title?: string;
  description?: string;
  otherContext?: string;
}): Promise<PhotoVerificationResult> {
  const imagePart = await buildImagePart(input.imageUri);
  if (!imagePart) {
    return safeManualReview('Image could not be processed. Marked for manual review.');
  }

  try {
    return await callGemini([
      { text: buildPhotoVerificationPrompt(input) },
      imagePart,
    ]);
  } catch {
    return safeManualReview('AI verification failed unexpectedly. Marked for manual review.');
  }
}

export async function verifyIssueFixBeforeAfter(input: {
  beforeImageUri: string;
  afterImageUri: string;
  selectedCategory?: string;
  originalTitle?: string;
  originalDescription?: string;
  fixDescription?: string;
}): Promise<PhotoVerificationResult> {
  const [beforePart, afterPart] = await Promise.all([
    buildImagePart(input.beforeImageUri),
    buildImagePart(input.afterImageUri),
  ]);

  if (!beforePart || !afterPart) {
    return safeManualReview('Before/after images could not be processed. Marked for manual review.');
  }

  try {
    return await callGemini([
      { text: buildBeforeAfterFixPrompt(input) },
      { text: 'BEFORE image:' },
      beforePart,
      { text: 'AFTER image:' },
      afterPart,
    ]);
  } catch {
    return safeManualReview('AI fix verification failed unexpectedly. Marked for manual review.');
  }
}

export async function verifyFalseCompletion(input: {
  beforeImageUri: string;
  afterImageUri: string;
  selectedCategory?: string;
  originalTitle?: string;
  originalDescription?: string;
  fixDescription?: string;
  falseCompletionDescription: string;
}): Promise<PhotoVerificationResult> {
  const [beforePart, afterPart] = await Promise.all([
    buildImagePart(input.beforeImageUri),
    buildImagePart(input.afterImageUri),
  ]);

  if (!beforePart || !afterPart) {
    return safeManualReview('Before/after images could not be processed. Marked for manual review.');
  }

  try {
    return await callGemini([
      { text: buildFalseCompletionPrompt(input) },
      { text: 'BEFORE image:' },
      beforePart,
      { text: 'AFTER image:' },
      afterPart,
    ]);
  } catch {
    return safeManualReview('AI verification failed unexpectedly. Marked for manual review.');
  }
}
