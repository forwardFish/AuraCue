import type { AuraGenerationPromptInput, AuraProvider, AuraProviderResult } from "./schemas";
import { parseAuraCardContentJson } from "./schemas";

type OpenAiCompatibleOptions = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  enabled?: boolean;
};

export function createOpenAiCompatibleProvider(options: OpenAiCompatibleOptions = {}): AuraProvider {
  const providerId = String(process.env.AURACUE_AI_PROVIDER || process.env.AI_PROVIDER || "").trim();
  const isDeepSeek = providerId === "deepseek";
  const enabled = options.enabled ?? ["openai", "openai-compatible", "deepseek"].includes(providerId);
  const apiKey = options.apiKey
    ?? process.env.AURACUE_OPENAI_API_KEY
    ?? process.env.OPENAI_API_KEY
    ?? process.env.AI_API_KEY
    ?? process.env.DEEPSEEK_API_KEY;
  const baseUrl = options.baseUrl
    ?? process.env.AURACUE_OPENAI_BASE_URL
    ?? process.env.AI_BASE_URL
    ?? process.env.DEEPSEEK_BASE_URL
    ?? (isDeepSeek ? "https://api.deepseek.com" : "https://api.openai.com/v1");
  const model = options.model
    ?? process.env.AURACUE_OPENAI_MODEL
    ?? process.env.AI_MODEL
    ?? process.env.DEEPSEEK_MODEL
    ?? (isDeepSeek ? "deepseek-chat" : "gpt-4o-mini");
  const providerName = isDeepSeek ? "deepseek-compatible" : "openai-compatible";

  return {
    name: providerName,
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
          response_format: { type: "json_object" },
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
        provider: providerName,
        generationSource: "ai",
        fallbackUsed: false,
        transcript: {
          provider: providerName,
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
