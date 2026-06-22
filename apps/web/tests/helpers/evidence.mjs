import { mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

export function writeEvidenceJson(targetPath, value) {
  const payload = `${JSON.stringify(value, null, 2)}\n`;
  try {
    mkdirSync(path.dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, payload);
    return targetPath;
  } catch (error) {
    const fallbackDir = path.join(os.tmpdir(), "auracue-evidence-fallback");
    mkdirSync(fallbackDir, { recursive: true });
    const fallbackPath = path.join(fallbackDir, `${path.basename(targetPath, path.extname(targetPath))}-${process.pid}-${Date.now()}${path.extname(targetPath)}`);
    writeFileSync(fallbackPath, payload);
    console.warn(`Evidence write fallback: ${fallbackPath} (${error?.code ?? error})`);
    return fallbackPath;
  }
}
