import { buildAuraCardPrompt, parseAuraCardJson } from "../../../packages/prompt-core/src/ai-aura-card.mjs";

const providers = {
  deepseek: {
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-chat",
    apiKeyEnv: "DEEPSEEK_API_KEY"
  },
  openaiCompatible: {
    label: "OpenAI-compatible",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    apiKeyEnv: "AI_API_KEY"
  }
};

function cleanBaseUrl(url = "") {
  return String(url || "").trim().replace(/\/$/, "");
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

export function resolveAiProvider(env = process.env) {
  const providerId = String(env.AI_PROVIDER || "deepseek").trim();
  const provider = providers[providerId] || providers.deepseek;
  const apiKey = String(
    env.AI_API_KEY ||
    env[provider.apiKeyEnv] ||
    env.DEEPSEEK_API_KEY ||
    ""
  ).trim();

  return {
    providerId: providers[providerId] ? providerId : "deepseek",
    providerLabel: provider.label,
    apiKey,
    baseUrl: cleanBaseUrl(env.AI_BASE_URL || env.DEEPSEEK_BASE_URL || provider.baseUrl),
    model: String(env.AI_MODEL || env.DEEPSEEK_MODEL || provider.model).trim(),
    requestTimeoutMs: positiveNumber(env.AI_TIMEOUT_MS || env.DEEPSEEK_TIMEOUT_MS, 20000),
    maxTokens: positiveNumber(env.AI_MAX_TOKENS || env.DEEPSEEK_MAX_TOKENS, 1200)
  };
}

export function publicAiProviderConfig(config = resolveAiProvider()) {
  return {
    providerId: config.providerId,
    providerLabel: config.providerLabel,
    baseUrl: config.baseUrl,
    model: config.model,
    hasApiKey: Boolean(config.apiKey)
  };
}

export async function generateAuraCardWithAi({
  scene,
  energy,
  locale = "en-US",
  env = process.env,
  fetchImpl = globalThis.fetch
}) {
  const config = resolveAiProvider(env);
  if (!config.apiKey) {
    return {
      ok: false,
      reason: "missing-api-key",
      config: publicAiProviderConfig(config)
    };
  }
  if (typeof fetchImpl !== "function") {
    return {
      ok: false,
      reason: "fetch-unavailable",
      config: publicAiProviderConfig(config)
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs);
  const { system, user } = buildAuraCardPrompt({ scene, energy, locale });

  try {
    const response = await fetchImpl(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        temperature: 0.7,
        max_tokens: config.maxTokens,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: `http-${response.status}`,
        config: publicAiProviderConfig(config)
      };
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    const card = parseAuraCardJson(content);
    return {
      ok: true,
      content: card,
      config: publicAiProviderConfig(config)
    };
  } catch (error) {
    return {
      ok: false,
      reason: error?.name === "AbortError" ? "timeout" : "invalid-ai-response",
      config: publicAiProviderConfig(config)
    };
  } finally {
    clearTimeout(timeout);
  }
}
