export const draftStorageKey = "auracue:web:draft:v1";

export const draftFields = [
  "mood",
  "context",
  "uploadId",
  "drawSessionId",
  "drawPosition"
];

const emptyDraft = Object.freeze({
  mood: null,
  context: null,
  uploadId: null,
  drawSessionId: null,
  drawPosition: null
});

export function createDraftStore(storage = resolveDefaultStorage()) {
  return {
    key: draftStorageKey,
    load() {
      return readDraft(storage);
    },
    save(patch) {
      const nextDraft = sanitizeDraft({ ...readDraft(storage), ...patch });
      writeDraft(storage, nextDraft);
      return nextDraft;
    },
    setField(field, value) {
      if (!draftFields.includes(field)) {
        return readDraft(storage);
      }
      return this.save({ [field]: value });
    },
    clear() {
      storage?.removeItem?.(draftStorageKey);
      return { ...emptyDraft };
    }
  };
}

export function readDraft(storage = resolveDefaultStorage()) {
  if (!storage?.getItem) {
    return { ...emptyDraft };
  }
  const raw = storage.getItem(draftStorageKey);
  if (!raw) {
    return { ...emptyDraft };
  }
  try {
    return sanitizeDraft(JSON.parse(raw));
  } catch {
    return { ...emptyDraft };
  }
}

export function writeDraft(storage, draft) {
  storage?.setItem?.(draftStorageKey, JSON.stringify(sanitizeDraft(draft)));
}

export function sanitizeDraft(value) {
  const record = isRecord(value) ? value : {};
  return {
    mood: nullableString(record.mood),
    context: nullableString(record.context),
    uploadId: nullableString(record.uploadId),
    drawSessionId: nullableString(record.drawSessionId),
    drawPosition: nullableInteger(record.drawPosition)
  };
}

function resolveDefaultStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function nullableString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function nullableInteger(value) {
  return Number.isInteger(value) && value > 0 ? value : null;
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
