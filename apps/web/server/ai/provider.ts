import type { AuraGenerationPromptInput, AuraProviderResult } from "./schemas";
import { createMockAuraProvider, buildMockAuraProviderResult } from "./mock-provider";
import { createOpenAiCompatibleProvider } from "./openai-compatible-provider";

export async function generateAuraCardWithFallback(input: AuraGenerationPromptInput): Promise<AuraProviderResult> {
  if (process.env.AURACUE_AI_FORCE_FAILURE === "1") {
    return buildMockAuraProviderResult(input, "mock-fallback-forced");
  }

  try {
    return await createOpenAiCompatibleProvider().generate(input);
  } catch (error) {
    const fallback = await createMockAuraProvider().generate(input);
    return {
      ...fallback,
      provider: "mock-fallback",
      transcript: {
        ...fallback.transcript,
        fallbackReason: error instanceof Error ? error.message : "unknown provider failure"
      }
    };
  }
}
