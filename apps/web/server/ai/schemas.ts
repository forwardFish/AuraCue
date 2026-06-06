import { localGenerationStructuredFields } from "@auracue/prompt-core";

export type AuraGenerationInput = {
  anonymousId: string;
  platform: "web" | "wechat";
  drawSessionId: string;
  drawPosition: number;
  locale: string;
};

export type AuraGenerationPromptInput = AuraGenerationInput & {
  mood: string;
  context: string | null;
  drawSeed: string;
  scene: string;
  energy: string;
  uploadStyleNotes: Record<string, unknown> | null;
};

export type AuraCardContent = Record<string, unknown> & {
  title: string;
  auraName: string;
  tarotSymbol: string;
  message: string;
  luckyColor: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
  outfit: string;
  beauty: string;
  social: string;
  ritual: string;
  avoid: string;
  caption: string;
  theme: string;
  cardTitle: string;
  auraColor: string;
  luckyColors: string[];
  styleVibe: string;
  energyMessage: string;
  outfitEnergy: string;
  beautyCue: string;
  socialMove: string;
  miniRitual: string;
  todayIntention: string;
  luckyAnchorCandidates: Array<{ type: string; label: string }>;
  luckyAnchorSuggestions: Array<{ type: string; label: string }>;
  generatedAt: string;
  generationSource: "ai" | "local-fallback";
  fallbackUsed: boolean;
};

export type AuraProviderResult = {
  content: AuraCardContent;
  provider: string;
  generationSource: "ai" | "local-fallback";
  fallbackUsed: boolean;
  transcript: Record<string, unknown>;
};

export type AuraProvider = {
  name: string;
  generate(input: AuraGenerationPromptInput): Promise<AuraProviderResult>;
};

export function normalizeGenerationInput(body: Record<string, unknown>): AuraGenerationInput | {
  error: { message: string; details: Record<string, unknown> };
} {
  const anonymousId = requiredString(body.anonymousId);
  const platform = requiredString(body.platform);
  const drawSessionId = requiredString(body.drawSessionId);
  const drawPosition = numberFrom(body.drawPosition);
  const locale = optionalString(body.locale) ?? optionalString(body.language) ?? "en-US";

  if (!anonymousId) {
    return validation("anonymousId is required.", { field: "anonymousId" });
  }
  if (platform !== "web" && platform !== "wechat") {
    return validation("platform must be web or wechat.", { field: "platform", actual: platform ?? null });
  }
  if (!drawSessionId) {
    return validation("drawSessionId is required.", { field: "drawSessionId" });
  }
  if (!Number.isInteger(drawPosition) || drawPosition < 1 || drawPosition > 3) {
    return validation("drawPosition must be 1, 2, or 3.", { field: "drawPosition", actual: body.drawPosition ?? null });
  }

  return { anonymousId, platform, drawSessionId, drawPosition, locale };
}

export function validateAuraCardContent(payload: unknown): AuraCardContent {
  const record = asRecord(payload);
  for (const field of localGenerationStructuredFields) {
    if (field === "colors") {
      continue;
    }
    requireNonEmptyString(record[field], field);
  }

  const colors = asRecord(record.colors);
  const primary = requireNonEmptyString(colors.primary, "colors.primary");
  const accent = requireNonEmptyString(colors.accent, "colors.accent");
  const background = requireNonEmptyString(colors.background, "colors.background");

  const title = requireNonEmptyString(record.title, "title");
  const auraName = requireNonEmptyString(record.auraName, "auraName");
  const luckyColor = requireNonEmptyString(record.luckyColor, "luckyColor");
  const outfit = requireNonEmptyString(record.outfit, "outfit");
  const beauty = requireNonEmptyString(record.beauty, "beauty");
  const social = requireNonEmptyString(record.social, "social");
  const ritual = requireNonEmptyString(record.ritual, "ritual");
  const message = requireNonEmptyString(record.message, "message");

  return {
    ...record,
    title,
    auraName,
    tarotSymbol: requireNonEmptyString(record.tarotSymbol, "tarotSymbol"),
    message,
    luckyColor,
    colors: { primary, accent, background },
    outfit,
    beauty,
    social,
    ritual,
    avoid: requireNonEmptyString(record.avoid, "avoid"),
    caption: requireNonEmptyString(record.caption, "caption"),
    theme: requireNonEmptyString(record.theme, "theme"),
    cardTitle: stringOr(record.cardTitle, title),
    auraColor: stringOr(record.auraColor, luckyColor),
    luckyColors: stringArrayOr(record.luckyColors, [luckyColor, accent]),
    styleVibe: stringOr(record.styleVibe, `${auraName} ${luckyColor}`),
    energyMessage: stringOr(record.energyMessage, message),
    outfitEnergy: stringOr(record.outfitEnergy, outfit),
    beautyCue: stringOr(record.beautyCue, beauty),
    socialMove: stringOr(record.socialMove, social),
    miniRitual: stringOr(record.miniRitual, ritual),
    todayIntention: stringOr(record.todayIntention, message),
    luckyAnchorCandidates: anchorArrayOr(record.luckyAnchorCandidates, luckyColor),
    luckyAnchorSuggestions: anchorArrayOr(record.luckyAnchorSuggestions, luckyColor),
    generatedAt: stringOr(record.generatedAt, new Date().toISOString()),
    generationSource: record.generationSource === "ai" ? "ai" : "local-fallback",
    fallbackUsed: record.fallbackUsed !== false
  };
}

export function parseAuraCardContentJson(text: string): AuraCardContent {
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  const source = start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed;
  return validateAuraCardContent(JSON.parse(source));
}

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function validation(message: string, details: Record<string, unknown>) {
  return { error: { message, details } };
}

function requiredString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function optionalString(value: unknown) {
  return requiredString(value);
}

function numberFrom(value: unknown) {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    return Number(value);
  }
  return NaN;
}

function requireNonEmptyString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Aura Card missing ${field}.`);
  }
  return value.trim();
}

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringArrayOr(value: unknown, fallback: string[]) {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim())
    ? value.map((item) => item.trim())
    : fallback;
}

function anchorArrayOr(value: unknown, luckyColor: string) {
  if (Array.isArray(value)) {
    const anchors = value
      .map((item) => asRecord(item))
      .filter((item) => typeof item.type === "string" && typeof item.label === "string")
      .map((item) => ({ type: String(item.type), label: String(item.label) }));
    if (anchors.length > 0) {
      return anchors;
    }
  }
  return [
    { type: "lucky_color", label: luckyColor },
    { type: "outfit_detail", label: "one polished detail" }
  ];
}
