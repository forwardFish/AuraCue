import { createHash } from "node:crypto";

export type ShareCardTemplate = {
  templateId: string;
  aspectRatio: "9:16";
  renderer: "deterministic-local-renderer";
  format: "story-9x16";
  width: 1080;
  height: 1920;
};

export const defaultShareCardTemplate: ShareCardTemplate = {
  templateId: "template-story-001",
  aspectRatio: "9:16",
  renderer: "deterministic-local-renderer",
  format: "story-9x16",
  width: 1080,
  height: 1920
};

export type LocalShareRenderMetadata = {
  cardId: string;
  templateId: string;
  format: "story-9x16";
  localPath: string;
  width: 1080;
  height: 1920;
  aspectRatio: "9:16";
  renderer: "deterministic-local-renderer";
  deterministicKey: string;
  artifactKind: "svg-data-url";
  dataUrl: string;
  dataUrlSha256: string;
  textFields: {
    title: string;
    auraName: string;
    tarotSymbol: string;
    message: string;
    luckyColor: string;
    outfit: string;
    beauty: string;
    social: string;
    ritual: string;
    avoid: string;
    caption: string;
    theme: string;
  };
  layers: Array<{
    type: string;
    text?: string;
    color?: string;
  }>;
};

type LocalShareRenderInput = {
  card: {
    id: string;
    content: Record<string, unknown>;
  };
  template?: Partial<ShareCardTemplate>;
};

export function renderLocalShareCard({ card, template = defaultShareCardTemplate }: LocalShareRenderInput): LocalShareRenderMetadata {
  const normalizedTemplate: ShareCardTemplate = {
    ...defaultShareCardTemplate,
    ...template,
    aspectRatio: "9:16",
    renderer: "deterministic-local-renderer",
    format: "story-9x16",
    width: 1080,
    height: 1920
  };
  const content = card.content;
  const textFields = {
    title: stringField(content, "title", stringField(content, "cardTitle", "Today's Aura")),
    auraName: stringField(content, "auraName", "AuraCue Glow"),
    tarotSymbol: stringField(content, "tarotSymbol", "Daily Signal"),
    message: stringField(content, "message", stringField(content, "energyMessage", "A grounded cue for today.")),
    luckyColor: stringField(content, "luckyColor", firstString(content.luckyColors, stringField(content, "auraColor", "Soft Gold"))),
    outfit: stringField(content, "outfit", stringField(content, "outfitEnergy", "Choose one polished detail.")),
    beauty: stringField(content, "beauty", stringField(content, "beautyCue", "Keep one soft highlight.")),
    social: stringField(content, "social", stringField(content, "socialMove", "Lead with a calm opening.")),
    ritual: stringField(content, "ritual", stringField(content, "miniRitual", "Take three slow breaths.")),
    avoid: stringField(content, "avoid", "Avoid rushing the first step."),
    caption: stringField(content, "caption", stringField(content, "shareCaption", "Today I am carrying my AuraCue.")),
    theme: stringField(content, "theme", stringField(content, "styleVibe", "Warm daily aura"))
  };
  const deterministicKey = [
    card.id,
    normalizedTemplate.templateId,
    textFields.title,
    textFields.auraName,
    textFields.luckyColor,
    textFields.theme,
    textFields.caption
  ].join("|");
  const layers = [
    { type: "background", color: colorField(content, "background", "#fff7ee") },
    { type: "title", text: textFields.title },
    { type: "auraName", text: textFields.auraName },
    { type: "tarotSymbol", text: textFields.tarotSymbol },
    { type: "luckyColor", text: textFields.luckyColor },
    { type: "outfit", text: textFields.outfit },
    { type: "social", text: textFields.social },
    { type: "ritual", text: textFields.ritual },
    { type: "caption", text: textFields.caption }
  ];
  const svg = buildStorySvg({ cardId: card.id, template: normalizedTemplate, textFields });
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;

  return {
    cardId: card.id,
    templateId: normalizedTemplate.templateId,
    format: normalizedTemplate.format,
    localPath: `local://share-images/${card.id}-${normalizedTemplate.templateId}.png`,
    width: normalizedTemplate.width,
    height: normalizedTemplate.height,
    aspectRatio: normalizedTemplate.aspectRatio,
    renderer: normalizedTemplate.renderer,
    deterministicKey,
    artifactKind: "svg-data-url",
    dataUrl,
    dataUrlSha256: sha256(dataUrl),
    textFields,
    layers
  };
}

export const buildLocalShareRenderMetadata = renderLocalShareCard;

function stringField(record: Record<string, unknown>, key: string, fallback: string) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function firstString(value: unknown, fallback: string) {
  return Array.isArray(value) && typeof value[0] === "string" ? value[0] : fallback;
}

function colorField(record: Record<string, unknown>, key: string, fallback: string) {
  const colors = record.colors;
  if (colors && typeof colors === "object" && !Array.isArray(colors)) {
    const value = (colors as Record<string, unknown>)[key];
    return typeof value === "string" ? value : fallback;
  }
  return fallback;
}

function buildStorySvg(input: {
  cardId: string;
  template: ShareCardTemplate;
  textFields: LocalShareRenderMetadata["textFields"];
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${input.template.width}" height="${input.template.height}" viewBox="0 0 ${input.template.width} ${input.template.height}" role="img" aria-label="AuraCue ${escapeXml(input.textFields.auraName)} share card">
  <rect width="1080" height="1920" fill="#fff7ee"/>
  <rect x="42" y="42" width="996" height="1836" rx="64" fill="none" stroke="#d4af37" stroke-width="4"/>
  <text x="540" y="176" text-anchor="middle" fill="#7a4a16" font-family="Georgia, serif" font-size="42">AURACUE</text>
  <text x="540" y="292" text-anchor="middle" fill="#2a1a4a" font-family="Georgia, serif" font-size="82" font-weight="700">${escapeXml(input.textFields.title)}</text>
  <text x="540" y="382" text-anchor="middle" fill="#7a6b5c" font-family="Inter, Arial, sans-serif" font-size="42">${escapeXml(input.textFields.tarotSymbol)}</text>
  <rect x="96" y="1080" width="888" height="696" rx="54" fill="#ffffff"/>
  <text x="540" y="1198" text-anchor="middle" fill="#2a1a4a" font-family="Georgia, serif" font-size="68" font-weight="700">${escapeXml(input.textFields.auraName)}</text>
  <text x="540" y="1272" text-anchor="middle" fill="#7a6b5c" font-family="Inter, Arial, sans-serif" font-size="34">${escapeXml(input.textFields.theme)}</text>
  ${detailRow(180, 1382, "Lucky Color", input.textFields.luckyColor)}
  ${detailRow(180, 1480, "Outfit Energy", input.textFields.outfit)}
  ${detailRow(180, 1578, "Social Action", input.textFields.social)}
  ${detailRow(180, 1676, "Tiny Ritual", input.textFields.ritual)}
  <text x="540" y="1748" text-anchor="middle" fill="#2a1a4a" font-family="Georgia, serif" font-size="30" font-style="italic">${escapeXml(input.textFields.caption)}</text>
</svg>`;
}

function detailRow(x: number, y: number, label: string, value: string) {
  return `<text x="${x}" y="${y}" fill="#7a6b5c" font-family="Inter, Arial, sans-serif" font-size="30">${escapeXml(label)}</text>
  <text x="900" y="${y}" text-anchor="end" fill="#2a1a4a" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700">${escapeXml(value)}</text>`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
