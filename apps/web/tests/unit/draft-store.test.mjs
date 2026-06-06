import assert from "node:assert/strict";
import {
  createDraftStore,
  draftFields,
  draftStorageKey,
  readDraft,
  sanitizeDraft
} from "../../lib/draft-store.js";

const storage = createMemoryStorage();
const store = createDraftStore(storage);

assert.deepEqual(store.load(), {
  mood: null,
  context: null,
  uploadId: null,
  drawSessionId: null,
  drawPosition: null
});

const saved = store.save({
  mood: " confident ",
  context: "work",
  uploadId: "upload_1",
  drawSessionId: "draw_1",
  drawPosition: 2,
  cardId: "must-not-persist",
  activationId: "must-not-persist"
});

assert.deepEqual(saved, {
  mood: "confident",
  context: "work",
  uploadId: "upload_1",
  drawSessionId: "draw_1",
  drawPosition: 2
});
assert.equal(JSON.parse(storage.getItem(draftStorageKey)).cardId, undefined);
assert.equal(JSON.parse(storage.getItem(draftStorageKey)).activationId, undefined);

store.setField("context", "date");
assert.equal(readDraft(storage).context, "date");

store.setField("cardId", "still-not-persisted");
assert.equal(readDraft(storage).cardId, undefined);

storage.setItem(draftStorageKey, "{bad json");
assert.equal(readDraft(storage).mood, null);

assert.deepEqual(sanitizeDraft({ mood: "calm", drawPosition: -1 }), {
  mood: "calm",
  context: null,
  uploadId: null,
  drawSessionId: null,
  drawPosition: null
});

store.clear();
assert.equal(storage.getItem(draftStorageKey), null);
assert.deepEqual(draftFields, ["mood", "context", "uploadId", "drawSessionId", "drawPosition"]);

console.log(JSON.stringify({
  status: "PASS",
  suite: "draft-store",
  storageKey: draftStorageKey,
  persistedFields: draftFields,
  blockedFields: ["cardId", "activationId"]
}, null, 2));

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    }
  };
}
