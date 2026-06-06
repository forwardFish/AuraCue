export const copySafetyCategories = [
  {
    id: "guaranteed_destiny_change",
    description: "No guaranteed destiny/fate/life outcome claims.",
    patterns: [
      /\bguarantee(?:d|s)?\b/i,
      /\bwill\s+(?:change|fix|transform)\s+your\s+(?:destiny|fate|life)\b/i,
      /\bdestiny\s+(?:will|is)\b/i,
      /\bfate\s+(?:will|is)\b/i
    ]
  },
  {
    id: "negative_judgment",
    description: "No negative personal judgment or blame.",
    patterns: [
      /\b(?:ugly|worthless|unlovable|undesirable)\b/i,
      /\b(?:bad|toxic|broken)\s+(?:energy|aura|personality|vibe)\b/i,
      /\byour\s+(?:fault|problem)\b/i
    ]
  },
  {
    id: "appearance_anxiety",
    description: "No body/face flaw anxiety or pressure to alter appearance.",
    patterns: [
      /\b(?:hide|fix|correct)\s+(?:your\s+)?(?:flaws|face|body|skin|weight)\b/i,
      /\b(?:look|become)\s+(?:thinner|prettier|younger|sexier)\b/i,
      /\b(?:flawless|perfect)\s+(?:face|body|skin)\b/i
    ]
  },
  {
    id: "therapy_medical_claim",
    description: "No therapy, diagnosis, cure, or medical/mental-health treatment claim.",
    patterns: [
      /\b(?:therapy|therapist|medical|clinical|diagnos(?:e|is)|treatment)\b/i,
      /\b(?:cure|heal|treat)\s+(?:anxiety|depression|illness|trauma|disease)\b/i,
      /\bmental\s+health\s+(?:treatment|diagnosis|cure)\b/i
    ]
  },
  {
    id: "mandatory_selfie",
    description: "No mandatory selfie/photo upload requirement.",
    patterns: [
      /\b(?:must|required|mandatory)\s+(?:upload|take|send)\s+(?:a\s+)?(?:selfie|photo|picture)\b/i,
      /\b(?:selfie|photo)\s+(?:is\s+)?required\b/i
    ]
  }
];

function flattenCopy(value, path = "$") {
  if (typeof value === "string") {
    return [{ path, text: value }];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenCopy(item, `${path}[${index}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => flattenCopy(item, `${path}.${key}`));
  }
  return [];
}

export function scanCopySafety(value, { source = "inline" } = {}) {
  const textItems = flattenCopy(value);
  const violations = [];
  for (const item of textItems) {
    for (const category of copySafetyCategories) {
      const matchedPattern = category.patterns.find((pattern) => pattern.test(item.text));
      if (matchedPattern) {
        violations.push({
          source,
          path: item.path,
          category: category.id,
          description: category.description,
          matchedPattern: String(matchedPattern),
          text: item.text
        });
      }
    }
  }

  return {
    safe: violations.length === 0,
    checkedTextCount: textItems.length,
    categories: copySafetyCategories.map((category) => category.id),
    violations
  };
}

export function assertSafeCopy(value, options = {}) {
  return scanCopySafety(value, options);
}
