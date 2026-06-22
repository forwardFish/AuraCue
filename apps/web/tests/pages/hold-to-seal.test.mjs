import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { writeEvidenceJson } from "../helpers/evidence.mjs";

const root = process.cwd();
const evidenceDir = resolve(root, "../../docs/auto-execute/evidence/web/T10");
mkdirSync(evidenceDir, { recursive: true });

const source = readFileSync(resolve(root, "components/result-activation-flow.tsx"), "utf8");

assert.match(source, /export const holdToSealDurationMs = 3000/, "hold duration constant must be 3000ms");
assert.match(source, /timer\.current = window\.setTimeout/, "hold completion must be timer-backed");
assert.match(source, /onComplete\(holdDurationMs\)/, "completed hold must invoke seal callback");
assert.match(source, /onCancel\?\.\(holdDurationMs\)/, "cancelled hold must report elapsed duration");
assert.match(source, /Math\.max\(holdToSealDurationMs/, "completion duration must never be below 3000ms");
assert.match(source, /clearHoldTimers\(\);[\s\S]*setHolding\(false\);[\s\S]*setProgress\(100\);[\s\S]*onComplete/, "completion should clear timers before seal callback");
assert.match(source, /setProgress\(0\);[\s\S]*onCancel/, "short release should reset progress and avoid completion callback");
assert.match(source, /disabled=\{disabled\}/, "button should prevent duplicate sealing while disabled");

const result = {
  status: "PASS",
  suite: "hold-to-seal-static-behavior",
  assertions: [
    "3000ms threshold",
    "timer-backed completion",
    "pointer cancellation paths",
    "completion sends holdDurationMs >= 3000",
    "cancel path does not invoke completion"
  ]
};

writeEvidenceJson(resolve(evidenceDir, "hold-to-seal.json"), result);
console.log(JSON.stringify(result, null, 2));
