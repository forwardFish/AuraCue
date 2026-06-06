export type LocalGenerationInput = {
  scene: string;
  energy: string;
};

export function describeLocalGenerationBoundary(input: LocalGenerationInput) {
  return {
    ...input,
    provider: "deterministic-local-only",
    realAiCallsAllowed: false
  };
}

export const localGenerationStructuredFields = [
  "title",
  "auraName",
  "tarotSymbol",
  "message",
  "luckyColor",
  "colors",
  "outfit",
  "beauty",
  "social",
  "ritual",
  "avoid",
  "caption",
  "theme"
] as const;

export type CopySafetyCategory =
  | "guaranteed_destiny_change"
  | "negative_judgment"
  | "appearance_anxiety"
  | "therapy_medical_claim"
  | "mandatory_selfie";
