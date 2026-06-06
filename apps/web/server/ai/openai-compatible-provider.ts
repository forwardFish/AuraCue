import type { AuraGenerationPromptInput, AuraProvider, AuraProviderResult } from "./schemas";
import { parseAuraCardContentJson } from "./schemas";

type OpenAiCompatibleOptions = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  enabled?: boolean;
};

export function createOpenAiCompatibleProvider(options: OpenAiCompatibleOptions = {}): AuraProvider {
  const apiKey = options.apiKey ?? process.env.AURACUE_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
  const enabled = options.enabled ?? process.env.AURACUE_AI_PROVIDER === "openai";
  const baseUrl = options.baseUrl ?? process.env.AURACUE_OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const model = options.model ?? process.env.AURACUE_OPENAI_MODEL ?? "gpt-4o-mini";

  return {
    name: "openai-compatible",
    async generate(input: AuraGenerationPromptInput): Promise<AuraProviderResult> {
      if (!enabled || !apiKey) {
        throw new Error("OpenAI-compatible provider is not enabled with a local API key.");
      }

      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: ["Bearer", apiKey].join(" ")
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content: [
                "You generate AuraCue daily aura cards as strict JSON.",
                "Do not promise guaranteed luck, love, money, health, or success.",
                "Do not comment on body flaws, attractiveness, weight, face shape, or medical health.",
                "Return valid JSON only."
              ].join("\n")
            },
            {
              role: "user",
              content: JSON.stringify({
                locale: input.locale,
                mood: input.mood,
                context: input.context,
                scene: input.scene,
                energy: input.energy,
                drawPosition: input.drawPosition,
                requiredFields: [
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
                ]
              })
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI-compatible provider returned ${response.status}.`);
      }

      const payload = await response.json() as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const contentText = payload.choices?.[0]?.message?.content;
      if (!contentText) {
        throw new Error("OpenAI-compatible provider returned empty content.");
      }

      const content = parseAuraCardContentJson(contentText);
      return {
        content: {
          ...content,
          generationSource: "ai",
          fallbackUsed: false
        },
        provider: "openai-compatible",
        generationSource: "ai",
        fallbackUsed: false,
        transcript: {
          provider: "openai-compatible",
          mode: "authorized-live-call",
          model,
          responseStatus: response.status,
          contentLength: contentText.length,
          outputFields: Object.keys(content).sort()
        }
      };
    }
  };
}
