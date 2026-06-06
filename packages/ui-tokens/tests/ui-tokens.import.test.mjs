import assert from "node:assert/strict";

const tokens = await import("../src/index.ts");

const requiredExports = [
  "designViewport",
  "colorTokens",
  "typographyTokens",
  "spacingTokens",
  "radiusTokens",
  "shadowTokens",
  "borderTokens",
  "zDepthTokens",
  "cardProportionTokens",
  "backgroundTreatments",
  "ctaTokens",
  "visualMotifs",
  "uiReferenceInventory",
  "tokenCoverage"
];

for (const exportName of requiredExports) {
  assert.ok(tokens[exportName], `missing export ${exportName}`);
}

assert.equal(tokens.designViewport.width, 941);
assert.equal(tokens.designViewport.height, 1672);
assert.equal(tokens.uiReferenceInventory.length, 18);
assert.equal(new Set(tokens.uiReferenceInventory.map((item) => item.id)).size, 18);
assert.equal(tokens.tokenCoverage.perUiAssetInventory, 18);

const requiredCoverage = [
  "color",
  "typography",
  "spacing",
  "radius",
  "shadow",
  "border",
  "zDepth",
  "cardProportions",
  "backgroundTreatments",
  "ctaStyles"
];

for (const key of requiredCoverage) {
  assert.equal(tokens.tokenCoverage[key], true, `coverage ${key} should be true`);
}

for (const item of tokens.uiReferenceInventory) {
  assert.match(item.id, /^UI-\d{2}$/);
  assert.ok(item.route.length > 0, `${item.id} route missing`);
  assert.ok(item.sourceImage.endsWith(".png"), `${item.id} source image missing`);
  assert.ok(item.stitchId.length > 0, `${item.id} stitch id missing`);
  assert.ok(item.tokenNotes.length > 0, `${item.id} token notes missing`);
  assert.ok(item.requiredMotifs.length > 0, `${item.id} motifs missing`);
}

console.log(JSON.stringify({
  status: "PASS",
  checkedExports: requiredExports.length,
  uiReferences: tokens.uiReferenceInventory.length,
  viewport: tokens.designViewport
}, null, 2));
