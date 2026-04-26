export type PhotoVerificationStatus = 'verified' | 'uncertain' | 'manual-review';

export type PhotoVerificationResult = {
  isValid: boolean;
  confidence: number;
  suggestedCategory?: string;
  explanation: string;
  status: PhotoVerificationStatus;
};
