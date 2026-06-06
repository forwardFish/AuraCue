import { createHash } from "node:crypto";

export const defaultShareCardTemplate = {
  templateId: "template-story-001",
  aspectRatio: "9:16",
  renderer: "deterministic-local-renderer",
  format: "story-9x16",
  width: 1080,
  height: 1920
};

export function renderLocalShareCard({ card, template = defaultShareCardTemplate }) {
  const normalizedTemplate = normalizeTemplate(template);
  const content = card.content;
  const deterministicKey = [
    card.id,
    normalizedTemplate.templateId,
    content.title,
    content.auraName,
    content.luckyColor,
    content.theme,
    content.caption
  ].join("|");
  const textFields = {
    title: content.title,
    auraName: content.auraName,
    tarotSymbol: content.tarotSymbol,
    message: content.message,
    luckyColor: content.luckyColor,
    outfit: content.outfit,
    beauty: content.beauty,
    social: content.social,
    ritual: content.ritual,
    avoid: content.avoid,
    caption: content.caption,
    theme: content.theme
  };
  const layers = [
    { type: "background", color: content.colors.background },
    { type: "title", text: content.title },
    { type: "auraName", text: content.auraName },
    { type: "tarotSymbol", text: content.tarotSymbol },
    { type: "luckyColor", text: content.luckyColor },
    { type: "outfit", text: content.outfit },
    { type: "social", text: content.social },
    { type: "ritual", text: content.ritual },
    { type: "caption", text: content.caption }
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
    dataUrlSha256: createHash("sha256").update(dataUrl).digest("hex"),
    textFields,
    layers
  };
}

export function buildLocalShareRenderMetadata({ card, template = defaultShareCardTemplate }) {
  return renderLocalShareCard({ card, template });
}

function normalizeTemplate(template) {
  return {
    ...defaultShareCardTemplate,
    ...template,
    width: template.width ?? defaultShareCardTemplate.width,
    height: template.height ?? defaultShareCardTemplate.height,
    aspectRatio: "9:16",
    renderer: "deterministic-local-renderer",
    format: "story-9x16"
  };
}

function buildStorySvg({ cardId, template, textFields }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${template.width}" height="${template.height}" viewBox="0 0 ${template.width} ${template.height}" role="img" aria-label="AuraCue ${escapeXml(textFields.auraName)} share card">
  <defs>
    <linearGradient id="auracue-bg-${escapeXml(cardId)}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2a1a4a"/>
      <stop offset="42%" stop-color="#8d5bff"/>
      <stop offset="72%" stop-color="#f48fb1"/>
      <stop offset="100%" stop-color="#d4af37"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#auracue-bg-${escapeXml(cardId)})"/>
  <rect x="42" y="42" width="996" height="1836" rx="64" fill="none" stroke="#d4af37" stroke-width="4" opacity="0.72"/>
  <text x="540" y="176" text-anchor="middle" fill="#d4af37" font-family="Georgia, serif" font-size="42" letter-spacing="10">AURACUE</text>
  <text x="540" y="292" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="82" font-weight="700">${escapeXml(textFields.title)}</text>
  <text x="540" y="382" text-anchor="middle" fill="#fff7dc" font-family="Inter, Arial, sans-serif" font-size="42">${escapeXml(textFields.tarotSymbol)}</text>
  <rect x="96" y="1080" width="888" height="696" rx="54" fill="#fffdf8" opacity="0.92"/>
  <text x="540" y="1198" text-anchor="middle" fill="#2a1a4a" font-family="Georgia, serif" font-size="68" font-weight="700">${escapeXml(textFields.auraName)}</text>
  <text x="540" y="1272" text-anchor="middle" fill="#7a6b5c" font-family="Inter, Arial, sans-serif" font-size="34">${escapeXml(textFields.theme)}</text>
  ${detailRow(180, 1382, "Lucky Color", textFields.luckyColor)}
  ${detailRow(180, 1480, "Outfit Energy", textFields.outfit)}
  ${detailRow(180, 1578, "Social Action", textFields.social)}
  ${detailRow(180, 1676, "Tiny Ritual", textFields.ritual)}
  <text x="540" y="1748" text-anchor="middle" fill="#2a1a4a" font-family="Georgia, serif" font-size="30" font-style="italic">${escapeXml(textFields.caption)}</text>
</svg>`;
}

function detailRow(x, y, label, value) {
  return `<text x="${x}" y="${y}" fill="#7a6b5c" font-family="Inter, Arial, sans-serif" font-size="30">${escapeXml(label)}</text>
  <text x="900" y="${y}" text-anchor="end" fill="#2a1a4a" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700">${escapeXml(value)}</text>`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
