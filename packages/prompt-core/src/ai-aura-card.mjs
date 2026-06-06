import { assertSafeCopy } from "./safety-copy-guard.mjs";

const sceneLabels = {
  date: "date or romantic connection",
  work: "work, meeting, or professional presence",
  party: "party, social gathering, or public charm",
  luck: "general luck and light opportunity"
};

const energyLabels = {
  confidence: "confidence",
  luck: "luck",
  love: "love",
  calm: "calm",
  charm: "charm",
  focus: "focus"
};

const requiredStringFields = [
  "title",
  "auraName",
  "tarotSymbol",
  "message",
  "luckyColor",
  "outfit",
  "beauty",
  "social",
  "ritual",
  "avoid",
  "caption",
  "theme"
];

const requiredColorFields = ["primary", "accent", "background"];

function compactJsonContract() {
  return `{
  "title": "short card title",
  "auraName": "memorable aura name",
  "tarotSymbol": "tarot or symbolic archetype",
  "message": "one gentle, concrete reminder",
  "luckyColor": "one color name",
  "colors": {
    "primary": "primary color",
    "accent": "accent color",
    "background": "background color"
  },
  "outfit": "actionable outfit cue",
  "beauty": "safe beauty cue without appearance anxiety",
  "social": "specific social move",
  "ritual": "small pre-going-out ritual",
  "avoid": "one thing to avoid today",
  "caption": "shareable first-person caption",
  "theme": "lowercase hyphenated theme id"
}`;
}

export function buildAuraCardPrompt({ scene, energy, locale = "en-US" }) {
  return {
    system: [
      "You generate AuraCue daily aura cards as strict JSON.",
      "Return only one JSON object with the exact keys requested.",
      "The product is playful reflection, not fortune telling, therapy, medicine, or guaranteed destiny.",
      "Avoid negative body judgment, appearance anxiety, medical claims, deterministic predictions, and mandatory selfies.",
      "Keep copy concise, warm, concrete, and suitable for a WeChat mini-program card."
    ].join("\n"),
    user: [
      `Locale: ${locale}`,
      `Scene id: ${scene} (${sceneLabels[scene] ?? scene})`,
      `Energy id: ${energy} (${energyLabels[energy] ?? energy})`,
      "Generate an Aura Card JSON for this exact scene and energy.",
      "Use English copy unless the locale clearly asks for another language.",
      "Required JSON shape:",
      compactJsonContract()
    ].join("\n")
  };
}

function extractJsonObject(text) {
  if (typeof text !== "string" || text.trim() === "") {
    throw new Error("AI response content is empty.");
  }
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("AI response does not contain a JSON object.");
    }
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

function requireString(payload, field) {
  const value = payload?.[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`AI Aura Card missing string field: ${field}`);
  }
  return value.trim();
}

export function validateAuraCardContent(payload) {
  const content = {};
  for (const field of requiredStringFields) {
    content[field] = requireString(payload, field);
  }

  const colors = payload?.colors;
  if (!colors || typeof colors !== "object" || Array.isArray(colors)) {
    throw new Error("AI Aura Card missing colors object.");
  }
  content.colors = {};
  for (const field of requiredColorFields) {
    const value = colors[field];
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`AI Aura Card missing colors.${field}.`);
    }
    content.colors[field] = value.trim();
  }

  const safety = assertSafeCopy(content, { source: "ai-aura-card" });
  if (!safety.safe) {
    throw new Error(`AI Aura Card failed safety check: ${safety.violations[0]?.category ?? "unknown"}`);
  }

  return content;
}

export function parseAuraCardJson(text) {
  return validateAuraCardContent(extractJsonObject(text));
}
