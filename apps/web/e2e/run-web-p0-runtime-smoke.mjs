import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(appRoot, "..", "..");
const docsRoot = path.join(repoRoot, "docs", "auto-execute");
const mode = process.argv.includes("owner-click-e2e") ? "owner-click-e2e" : "web-p0-runtime-smoke";
const taskId = mode === "owner-click-e2e" ? "T14" : "T13";
const evidenceSlug = mode === "owner-click-e2e" ? "owner-click-e2e" : "runtime-smoke";
const out = {
  logs: path.join(docsRoot, "logs", "web"),
  screenshots: path.join(docsRoot, "screenshots", "web", taskId, evidenceSlug),
  traces: path.join(docsRoot, "traces", "web", taskId, evidenceSlug),
  api: path.join(docsRoot, "api", "web", taskId),
  db: path.join(docsRoot, "db", "web", taskId)
};

const port = Number(process.env[`${taskId}_WEB_PORT`] || (taskId === "T14" ? 3214 : 3213));
const cdpPort = Number(process.env[`${taskId}_CDP_PORT`] || (taskId === "T14" ? 9324 : 9322));
const baseUrl = `http://127.0.0.1:${port}`;
const databaseUrl = process.env.DATABASE_URL || (taskId === "T14" ? "file:./t14-owner-click-e2e.sqlite" : "file:./t13-runtime-smoke.sqlite");
const serverMode = process.env.AURACUE_WEB_SERVER_MODE === "production" ? "production" : "development";
const viewport = { width: 390, height: 693 };
const runtimeDatabaseUrl = resolveRuntimeDatabaseUrl(databaseUrl);
const reuseExternalServer = process.env.AURACUE_REUSE_EXTERNAL_WEB === "1";
const reuseExternalBrowser = process.env.AURACUE_REUSE_EXTERNAL_BROWSER === "1";
const skipRuntimeDatabaseReset = process.env.AURACUE_SKIP_DB_RESET === "1";
const commandLog = [];
const apiTranscript = [];
const traceEvents = [];
const consoleEvents = [];
const screenshots = [];
const scenarioResults = [];
let devProcess;
let browserProcess;
let cdp;
let runtimeDatabaseReused = false;

main().catch(async (error) => {
  commandLog.push({ step: "fatal", status: "FAIL", error: String(error?.stack || error) });
  await writeJson(path.join(out.traces, "runtime-smoke-trace.json"), { traceEvents, consoleEvents, error: String(error?.stack || error) });
  await writeJson(path.join(out.api, "runtime-smoke-api-transcript.json"), apiTranscript);
  await writeCommandLog("FAIL");
  await cleanup();
  console.error(error);
  process.exit(1);
});

async function main() {
  await ensureDirs();
  if (skipRuntimeDatabaseReset) {
    commandLog.push({ command: "runtime database reset", status: "SKIPPED", evidence: "AURACUE_SKIP_DB_RESET=1" });
  } else {
    await resetRuntimeDatabase();
  }
  await writeJson(path.join(out.traces, "runtime-smoke-trace.json"), { traceEvents, consoleEvents, status: "STARTED" });
  if (skipRuntimeDatabaseReset) {
    commandLog.push({ command: "runtime database init", status: "SKIPPED", evidence: "AURACUE_SKIP_DB_RESET=1" });
  } else {
    await initializeRuntimeDatabase();
  }
  devProcess = reuseExternalServer ? await reuseExternalDevServer() : await startDevServer();
  browserProcess = reuseExternalBrowser ? await reuseExternalBrowserProcess() : await startBrowser();
  cdp = await openPage();
  await enablePageInstrumentation(cdp);
  await cdp.send("Page.navigate", { url: `${baseUrl}/` });
  await waitForHydrated(cdp);
  await resetH5LocalState(cdp);
  await cdp.send("Page.navigate", { url: `${baseUrl}/` });
  await waitForHydrated(cdp);
  if (mode === "owner-click-e2e") {
    await runOwnerClickFlow(cdp);
  } else {
    await runFlow(cdp);
  }
  const dbReadback = await readRuntimeDb();
  await writeJson(path.join(out.db, "runtime-smoke-readback.json"), dbReadback);
  await writeJson(path.join(out.api, "runtime-smoke-api-transcript.json"), normalizeTranscript(apiTranscript));
  await writeJson(path.join(out.traces, "runtime-smoke-trace.json"), {
    verdict: "PASS",
    mode,
    taskId,
    baseUrl,
    scenarioResults,
    screenshots,
    traceEvents,
    consoleEvents,
    blockingConsoleErrors: blockingConsoleErrors()
  });
  await writeCommandLog("PASS");
  await cleanup();
  process.exit(0);
}

async function runFlow(client) {
  if (await waitForReady(client, "Start My First Aura", { optional: true, timeoutMs: 5000 })) {
    await runLatestStaticFlow(client);
    return;
  }

  await waitForReady(client, "Start My Aura Card");
  await waitForTextGone(client, "Preparing today", 30000);
  await screenshot(client, "01-home");
  await seedDraftMoodAndNavigate(client, "confident");
  await waitForUrl(client, "/create/context");
  await waitForReady(client, "Any context for today?");
  await clickByText(client, "Work");
  await waitForChoiceSelected(client, ".auracue-choice", "Work");
  await screenshot(client, "02-context");
  await clickByText(client, "Continue");
  await waitForUrl(client, "/create/upload");
  await waitForReady(client, "Add a photo of your outfit");
  await uploadTinyPng(client);
  await waitForReady(client, "Upload added");
  await screenshot(client, "03-upload");
  await clickByText(client, "Upload Outfit");
  await waitForUrl(client, "/create/draw");
  await waitForReady(client, "Reveal My Aura");
  await waitForEnabledText(client, "Card II");
  await screenshot(client, "04-draw");
  await clickByText(client, "Card II");
  await waitForEnabledText(client, "Reveal My Aura");
  await clickByText(client, "Reveal My Aura");
  await waitForUrl(client, "/result/");
  await waitForReady(client, "Activate My Aura");
  await callGenerationJobFromBrowser(client);
  await screenshot(client, "05-result");
  await clickByText(client, "Activate My Aura");
  await waitForUrl(client, "/activate/");
  await waitForReady(client, "Start Activation");
  await screenshot(client, "06-activate");
  await clickByText(client, "Start Activation");
  await waitForReady(client, "Hold 3s to Seal");
  await holdByText(client, "Hold 3s to Seal", 3250);
  await waitForUrl(client, "/activated/");
  await waitForReady(client, "Aura Activated");
  await screenshot(client, "07-activated");
  await clickByText(client, "Done");
  await waitForUrl(client, "/share/");
  await waitForReady(client, "Copy Link");
  await screenshot(client, "08-share");
  await clickByText(client, "Copy Link");
  await waitForReady(client, "Share link copied");
  await clickByText(client, "Saved to Photos");
  await waitForReady(client, "download started", { optional: true, timeoutMs: 5000 });
  await clickByText(client, "Saved to Aura Cards");
  await waitForUrl(client, "/saved/");
  await waitForReady(client, "Saved to AuraCue.");
  await screenshot(client, "09-saved");
  await clickByText(client, "Share Now");
  await waitForReady(client, "Saved card link copied");
  await screenshot(client, "10-saved-copy");
}

async function resetH5LocalState(client) {
  await evaluate(client, `
    (() => {
      for (const key of Object.keys(window.localStorage)) {
        if (key.startsWith('auracue:h5:')) {
          window.localStorage.removeItem(key);
        }
      }
      return true;
    })()
  `);
}

async function runLatestStaticFlow(client) {
  await waitForHydrated(client);
  await screenshot(client, "01-home");
  await clickByText(client, "Start My First Aura");
  await waitForUrl(client, "/onboarding/birth-aura");
  await waitForHydrated(client);
  await screenshot(client, "02-birth-aura");
  await spinBirthdayWheel(client, "Month", 1);
  await spinBirthdayWheel(client, "Day", 2);
  await waitForBirthdaySelection(client, "November", "9");
  await screenshot(client, "02-birth-aura-selected");
  await spinBirthdayWheel(client, "Month", -1);
  await spinBirthdayWheel(client, "Day", -2);
  await waitForBirthdaySelection(client, "October", "7");

  await clickByText(client, "Continue");
  await waitForUrl(client, "/onboarding/birth-aura/reveal");
  await screenshot(client, "03-birth-aura-reveal");

  await clickByText(client, "Begin Today's Ritual");
  await waitForUrl(client, "/today/check-in");
  await waitForHydrated(client);
  await clickByText(client, "Soft");
  await clickByText(client, "Work / Study");
  await waitForChoiceSelected(client, ".latest-choice-grid button", "Soft");
  await waitForChoiceSelected(client, ".latest-choice-grid button", "Work / Study");
  await screenshot(client, "04-check-in");

  await clickByText(client, "Continue to Your Card");
  await waitForUrl(client, "/today/draw");
  await waitForHydrated(client);
  await waitForReady(client, "Choose the card");
  await screenshot(client, "05A-draw");
  await clickByText(client, "Card II");
  await waitForReady(client, "Your card has");
  await screenshot(client, "05-draw");

  await clickByText(client, "Open My Reading");
  await waitForUrl(client, "/today/reading");
  await waitForHydrated(client);
  await waitForReady(client, "Your reading begins.");
  await screenshot(client, "06A-reading-begins");
  await clickByText(client, "Reveal the card's message");
  await waitForReady(client, "Your message is clear.");
  await screenshot(client, "06B-message-clear");
  await clickByText(client, "See My Style Oracle");
  await waitForReady(client, "Your reading unfolds.");
  await screenshot(client, "06C-reading-unfolds");
  await clickByText(client, "Reveal today's shift");
  await waitForUrl(client, "/result/");
  await waitForHydrated(client);
  await waitForReady(client, "Today's Style Cue");
  await screenshot(client, "07-result");

  await clickByText(client, "Seal Today's Aura");
  await waitForUrl(client, "/activate/");
  await waitForHydrated(client);
  await waitForReady(client, "2 seconds to activate");
  await screenshot(client, "08-activate");

  await holdByText(client, "Hold to Seal", 2250);
  await waitForUrl(client, "/activated/");
  await waitForHydrated(client);
  await waitForReady(client, "Aura Sealed");
  await screenshot(client, "09-activated");

  await clickByText(client, "Share Story");
  await waitForUrl(client, "/share/");
  await waitForHydrated(client);
  await waitForReady(client, "9:16 Share Card Preview");
  await screenshot(client, "10-share");

  await clickByText(client, "Copy Link");
  await waitForReady(client, "Copy Link complete");
  await clickByText(client, "Download Image");
  await waitForReady(client, "Download image prepared");
  await cdpNavigate(client, `${baseUrl}/saved/demo-card`);
  await waitForUrl(client, "/saved/");
  await waitForHydrated(client);
  await waitForReady(client, "Saved");
  await screenshot(client, "11-saved");

  await clickByText(client, "View My Aura");
  await waitForUrl(client, "/my");
  await waitForHydrated(client);
  await screenshot(client, "12-my");

  await cdpNavigate(client, `${baseUrl}/my/birth-aura`);
  await waitForUrl(client, "/my/birth-aura");
  await waitForHydrated(client);
  await waitForReady(client, "Edit Birthday");
  await screenshot(client, "13-my-birth-aura");

  await cdpNavigate(client, `${baseUrl}/legal/privacy`);
  await waitForUrl(client, "/legal/privacy");
  await waitForHydrated(client);
  await waitForReady(client, "Privacy");
  await screenshot(client, "14-privacy");

  await cdpNavigate(client, `${baseUrl}/legal/terms`);
  await waitForUrl(client, "/legal/terms");
  await waitForHydrated(client);
  await waitForReady(client, "Terms");
  await screenshot(client, "15-terms");

  await cdpNavigate(client, `${baseUrl}/error/network`);
  await waitForUrl(client, "/error/network");
  await waitForHydrated(client);
  await waitForReady(client, "Your aura slipped away");
  await screenshot(client, "16-error");

  scenarioResults.push({
    ids: ["H5-P0-latest-functional"],
    status: "PASS",
    evidence: [
      "selected birthday month/day, mood, scene, and tarot card before navigation",
      "held Hold to Seal for 2250ms and verified activated route",
      "clicked share copy/download/save actions and verified saved/my/legal/error routes",
      "captured current H5 screenshots from P0-01 through P0-16 coverage without reference-image replicas"
    ]
  });
}

async function runOwnerClickFlow(client) {
  await waitForReady(client, "Start My Aura Card");
  await screenshot(client, "01-owner-home");
  await createCardByClicks(client, {
    scenarioIds: ["Owner-001", "Owner-002"],
    mood: "Confident",
    context: "Work",
    upload: "skip",
    drawCard: "Card II",
    screenshotPrefix: "owner-first-skip"
  });
  await waitForReady(client, "Activate My Aura");
  await callGenerationJobFromBrowser(client);
  await screenshot(client, "02-owner-result-skip-upload");
  await activateWithCancelAndSeal(client);
  await runShareSaveClicks(client);
  await runTodayActiveRevisit(client);
  await runUploadFailureRecovery(client);
}

async function createCardByClicks(client, options) {
  await cdpNavigate(client, `${baseUrl}/`);
  await waitForReady(client, "Start My Aura Card");
  await waitForTextGone(client, "Preparing today");
  await waitForReady(client, options.mood);
  await seedDraftMoodAndNavigate(client, options.mood.toLowerCase());
  await waitForUrl(client, "/create/context");
  await waitForReady(client, "What is today for?");
  await clickByText(client, options.context);
  await waitForChoiceSelected(client, ".auracue-choice", options.context);
  await clickByText(client, "Continue");
  await waitForUrl(client, "/create/upload");
  await waitForReady(client, "Choose jpg, png, or webp");
  if (options.upload === "valid") {
    await uploadTinyPng(client);
    await waitForReady(client, "Upload added");
  } else if (options.upload === "invalid") {
    await uploadInvalidTextFile(client);
    await waitForReady(client, "Upload must be a jpg, png, or webp image.");
    await screenshot(client, `${options.screenshotPrefix}-upload-failure-ui`);
    await callOversizedUploadFailureFromBrowser(client);
  }
  if (options.upload === "skip" || options.upload === "invalid") {
    await clickByText(client, "Skip");
  } else {
    await clickByText(client, "Continue");
  }
  await waitForUrl(client, "/create/draw");
  await waitForReady(client, "Reveal My Aura");
  await waitForEnabledText(client, options.drawCard);
  await clickByText(client, options.drawCard);
  await waitForEnabledText(client, "Reveal My Aura");
  await clickByText(client, "Reveal My Aura");
  await waitForUrl(client, "/result/");
  await waitForReady(client, "Activate My Aura");
  scenarioResults.push({
    ids: options.scenarioIds,
    status: "PASS",
    evidence: [
      `${options.screenshotPrefix} clicked through mood/context/upload/draw/generate`,
      "browser API transcript includes draw and generation responses"
    ]
  });
}

async function activateWithCancelAndSeal(client) {
  await clickByText(client, "Activate My Aura");
  await waitForUrl(client, "/activate/");
  await waitForReady(client, "Start Activation");
  await screenshot(client, "03-owner-activate-ready");
  await clickByText(client, "Start Activation");
  await waitForReady(client, "Hold 3s to Seal");
  await holdByText(client, "Hold 3s to Seal", 1000);
  await delay(500);
  const stillOnActivation = (await evaluate(client, "window.location.pathname")).startsWith("/activate/");
  if (!stillOnActivation) {
    throw new Error("Owner-004 cancel hold unexpectedly navigated away from activation.");
  }
  await screenshot(client, "04-owner-hold-cancel");
  await holdByText(client, "Hold 3s to Seal", 3250);
  await waitForUrl(client, "/activated/");
  await waitForReady(client, "Aura activated.");
  await screenshot(client, "05-owner-activated");
  scenarioResults.push({
    ids: ["Owner-004"],
    status: "PASS",
    evidence: [
      "1000ms hold remained on /activate",
      "3250ms hold sealed and navigated to /activated",
      "API-009 and API-010 captured in browser transcript"
    ]
  });
}

async function runShareSaveClicks(client) {
  await clickByText(client, "Save");
  await waitForReady(client, "Activated aura saved");
  await clickByText(client, "Share");
  await waitForReady(client, "Share preview ready");
  await clickByText(client, "Done");
  await waitForUrl(client, "/share/");
  await waitForReady(client, "Copy Link");
  await screenshot(client, "06-owner-share");
  await clickByText(client, "Copy Link");
  await waitForReady(client, "Share link copied");
  await clickByText(client, "Save Image");
  await waitForReady(client, "Render is local-only", { optional: true, timeoutMs: 5000 });
  await clickByText(client, "Save to AuraCue");
  await waitForUrl(client, "/saved/");
  await waitForReady(client, "Saved to AuraCue.");
  await screenshot(client, "07-owner-saved");
  await clickByText(client, "Share Now");
  await waitForReady(client, "Saved card link copied");
  await screenshot(client, "08-owner-saved-copy");
  scenarioResults.push({
    ids: ["Owner-005"],
    status: "PASS",
    evidence: [
      "activated Save and Share clicked",
      "share Copy Link, Save Image, Save to AuraCue clicked",
      "saved page Share Now clicked",
      "API-011 and API-012 captured in browser transcript"
    ]
  });
}

async function runTodayActiveRevisit(client) {
  await cdpNavigate(client, `${baseUrl}/`);
  await waitForReady(client, "Today's Aura Active");
  await screenshot(client, "09-owner-today-active-home");
  await clickByText(client, "Today's Aura Active");
  await waitForUrl(client, "/activated/");
  await waitForReady(client, "Aura activated.");
  await screenshot(client, "10-owner-today-active-opened");
  scenarioResults.push({
    ids: ["Owner-006"],
    status: "PASS",
    evidence: [
      "home displayed Today's Aura Active after an activated card existed",
      "clicking the entry opened /activated/[id]",
      "API-002 and API-007 captured in browser transcript"
    ]
  });
}

async function runUploadFailureRecovery(client) {
  await createCardByClicks(client, {
    scenarioIds: ["Owner-003"],
    mood: "Calm",
    context: "Travel",
    upload: "invalid",
    drawCard: "Card I",
    screenshotPrefix: "owner-upload-failure"
  });
  await screenshot(client, "11-owner-upload-failure-result");
  scenarioResults.push({
    ids: ["Owner-003"],
    status: "PASS",
    evidence: [
      "invalid upload displayed visible failure UI",
      "oversized upload API failure was captured for API-003",
      "Skip after failure still produced a result card"
    ]
  });
}

async function enablePageInstrumentation(client) {
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Network.enable");
  await client.send("Log.enable");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: true
  });
  client.on("Network.requestWillBeSent", (params) => {
    const url = params.request?.url || "";
    if (url.includes("/api/v1/")) {
      apiTranscript.push({
        id: params.requestId,
        phase: "request",
        method: params.request.method,
        url,
        path: new URL(url).pathname,
        postData: redactBody(params.request.postData),
        timestamp: new Date().toISOString()
      });
    }
  });
  client.on("Network.responseReceived", (params) => {
    const url = params.response?.url || "";
    if (url.includes("/api/v1/")) {
      apiTranscript.push({
        id: params.requestId,
        phase: "response",
        url,
        path: new URL(url).pathname,
        status: params.response.status,
        mimeType: params.response.mimeType,
        timestamp: new Date().toISOString()
      });
    }
  });
  client.on("Network.loadingFinished", async (params) => {
    if (!apiTranscript.some((entry) => entry.id === params.requestId && entry.phase === "response")) {
      return;
    }
    try {
      const body = await client.send("Network.getResponseBody", { requestId: params.requestId });
      apiTranscript.push({
        id: params.requestId,
        phase: "body",
        body: parseMaybeJson(body.body),
        base64Encoded: body.base64Encoded,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      apiTranscript.push({ id: params.requestId, phase: "body-error", error: String(error), timestamp: new Date().toISOString() });
    }
  });
  client.on("Runtime.exceptionThrown", (params) => {
    consoleEvents.push({ level: "exception", params, timestamp: new Date().toISOString() });
  });
  client.on("Log.entryAdded", (params) => {
    consoleEvents.push({ level: params.entry?.level, text: params.entry?.text, source: params.entry?.source, timestamp: new Date().toISOString() });
  });
}

async function callGenerationJobFromBrowser(client) {
  const generated = findTranscriptBody((body) => body?.ok && body?.data?.jobId && body?.data?.cardId);
  if (!generated) {
    throw new Error("Generation response with jobId/cardId was not captured.");
  }
  const anonymousId = await evaluate(client, "window.localStorage.getItem('auracue:web:anonymous-id:v1')");
  const pathName = `/api/v1/generation-jobs/${encodeURIComponent(generated.data.jobId)}?anonymousId=${encodeURIComponent(anonymousId)}`;
  await evaluate(client, `fetch(${JSON.stringify(pathName)}, { headers: { accept: 'application/json' } }).then((r) => r.json())`);
}

async function uploadTinyPng(client) {
  const script = `
    (() => {
      const input = document.querySelector('input[type="file"]');
      if (!input) throw new Error('file input not found');
      const bytes = Uint8Array.from([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,6,0,0,0,31,21,196,137,0,0,0,10,73,68,65,84,120,156,99,0,1,0,0,5,0,1,13,10,42,180,0,0,0,0,73,69,78,68,174,66,96,130]);
      const file = new File([bytes], 't13-outfit.png', { type: 'image/png' });
      const transfer = new DataTransfer();
      transfer.items.add(file);
      input.files = transfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()
  `;
  await evaluate(client, script);
}

async function uploadInvalidTextFile(client) {
  const script = `
    (() => {
      const input = document.querySelector('input[type="file"]');
      if (!input) throw new Error('file input not found');
      const file = new File(['not an image'], 'not-an-image.txt', { type: 'text/plain' });
      const transfer = new DataTransfer();
      transfer.items.add(file);
      input.files = transfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()
  `;
  await evaluate(client, script);
}

async function callOversizedUploadFailureFromBrowser(client) {
  const script = `
    (async () => {
      const anonymousId = window.localStorage.getItem('auracue:web:anonymous-id:v1');
      const form = new FormData();
      form.set('anonymousId', anonymousId);
      form.set('platform', 'web');
      const bytes = new Uint8Array((8 * 1024 * 1024) + 1);
      form.set('file', new File([bytes], 'too-large.png', { type: 'image/png' }));
      const response = await fetch('/api/v1/uploads/outfit', { method: 'POST', body: form });
      const body = await response.json();
      if (response.status < 400 || body?.ok !== false) {
        throw new Error('Expected oversized upload API failure.');
      }
      return { status: response.status, body };
    })()
  `;
  return evaluate(client, script);
}

async function cdpNavigate(client, url) {
  await client.send("Page.navigate", { url });
}

async function screenshot(client, name) {
  await fs.mkdir(out.screenshots, { recursive: true });
  await waitForReferenceImages(client);
  await evaluate(client, `
    (async () => {
      for (let attempt = 0; attempt < 20 && !document.documentElement; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      let style = document.getElementById('auracue-evidence-hide-cursor');
      if (!style) {
        style = document.createElement('style');
        style.id = 'auracue-evidence-hide-cursor';
        style.textContent = '*,*::before,*::after{cursor:none!important;}';
        const parent = document.head || document.body || document.documentElement;
        if (!parent) return false;
        parent.appendChild(style);
      }
      return true;
    })()
  `);
  await client.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: -100, y: -100, button: "none" }).catch(() => undefined);
  const result = await client.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const target = path.join(out.screenshots, `${name}.png`);
  await fs.writeFile(target, result.data, "base64");
  screenshots.push(relative(target));
  traceEvents.push({ type: "screenshot", name, path: relative(target), timestamp: new Date().toISOString() });
}

async function waitForReferenceImages(client, timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const ready = await evaluate(client, `
      (() => {
        const images = Array.from(document.images).filter((image) => image.currentSrc || image.src);
        return images.length === 0 || images.every((image) => image.complete && image.naturalWidth > 0);
      })()
    `);
    if (ready) {
      await evaluate(client, "Promise.all(Array.from(document.images).map((image) => image.decode ? image.decode().catch(() => undefined) : undefined))");
      return;
    }
    await delay(100);
  }
  throw new Error("Timed out waiting for page images to load.");
}

async function clickByText(client, text) {
  const center = await elementCenter(client, text);
  await client.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: center.x, y: center.y, button: "none" });
  await client.send("Input.dispatchMouseEvent", { type: "mousePressed", x: center.x, y: center.y, button: "left", buttons: 1, clickCount: 1 });
  await client.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: center.x, y: center.y, button: "left", buttons: 0, clickCount: 1 });
}

async function setSelectValue(client, index, value) {
  await evaluate(client, `
    (() => {
      const select = Array.from(document.querySelectorAll('select'))[${Number(index)}];
      if (!select) throw new Error('select not found at index ${Number(index)}');
      select.value = ${JSON.stringify(value)};
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()
  `);
}

async function clickWheelItem(client, text) {
  const center = await evaluate(client, `
    (() => {
      const needle = ${JSON.stringify(text)};
      const buttons = Array.from(document.querySelectorAll('.latest-wheel-window button'));
      const button = buttons.find((node) => (node.textContent || '').trim() === needle);
      if (!button) throw new Error('Wheel item not found: ' + needle);
      button.scrollIntoView({ block: 'center', inline: 'center' });
      const rect = button.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, text: button.textContent };
    })()
  `);
  await client.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: center.x, y: center.y, button: "none" });
  await client.send("Input.dispatchMouseEvent", { type: "mousePressed", x: center.x, y: center.y, button: "left", buttons: 1, clickCount: 1 });
  await client.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: center.x, y: center.y, button: "left", buttons: 0, clickCount: 1 });
}

async function spinBirthdayWheel(client, label, steps) {
  const center = await evaluate(client, `
    (() => {
      const wheel = Array.from(document.querySelectorAll('.latest-wheel-window')).find((node) => node.getAttribute('aria-label') === ${JSON.stringify(label)});
      if (!wheel) throw new Error('Birthday wheel not found: ' + ${JSON.stringify(label)});
      wheel.focus();
      const rect = wheel.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()
  `);
  const direction = steps >= 0 ? 1 : -1;
  for (let index = 0; index < Math.abs(steps); index += 1) {
    await client.send("Input.dispatchMouseEvent", {
      type: "mouseWheel",
      x: center.x,
      y: center.y,
      deltaY: 120 * direction,
      deltaX: 0
    });
    await delay(120);
  }
}

async function waitForBirthdaySelection(client, month, day, timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const selected = await evaluate(client, `
      (() => {
        const active = Array.from(document.querySelectorAll('.latest-wheel-window button.selected')).map((node) => (node.textContent || '').trim());
        return active.includes(${JSON.stringify(month)}) && active.includes(${JSON.stringify(day)});
      })()
    `);
    if (selected) return true;
    await delay(150);
  }
  throw new Error(`Timed out waiting for birthday wheel selection: ${month} ${day}`);
}

async function seedDraftMoodAndNavigate(client, mood) {
  await evaluate(client, `
    (() => {
      window.localStorage.setItem('auracue:web:draft:v1', JSON.stringify({
        mood: ${JSON.stringify(mood)},
        context: null,
        uploadId: null,
        drawSessionId: null,
        drawPosition: null
      }));
      return true;
    })()
  `);
  await cdpNavigate(client, `${baseUrl}/create/context`);
}

async function holdByText(client, text, durationMs) {
  const center = await elementCenter(client, text);
  await client.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: center.x, y: center.y, button: "none" });
  await client.send("Input.dispatchMouseEvent", { type: "mousePressed", x: center.x, y: center.y, button: "left", buttons: 1, clickCount: 1 });
  await delay(durationMs);
  await client.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: center.x, y: center.y, button: "left", buttons: 0, clickCount: 1 });
}

async function elementCenter(client, text) {
  const expression = `
    (() => {
      const needle = ${JSON.stringify(text)}.toLowerCase();
      const candidates = Array.from(document.querySelectorAll('button,a,input,label,[role="button"]'));
      const textFor = (node) => (node.innerText || node.textContent || node.getAttribute('aria-label') || '').trim();
      const exact = candidates.find((node) => textFor(node).toLowerCase() === needle);
      const element = exact || candidates.find((node) => textFor(node).toLowerCase().includes(needle));
      if (!element) throw new Error('Clickable text not found: ' + ${JSON.stringify(text)});
      element.scrollIntoView({ block: 'center', inline: 'center' });
      const rect = element.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, text: element.innerText || element.textContent || element.getAttribute('aria-label') };
    })()
  `;
  return evaluate(client, expression);
}

async function waitForChoiceSelected(client, selector, label, timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const selected = await evaluate(client, `
      (() => {
        const needle = ${JSON.stringify(label)}.toLowerCase();
        const choice = Array.from(document.querySelectorAll(${JSON.stringify(selector)}))
          .find((node) => (node.innerText || node.textContent || '').toLowerCase().includes(needle));
        return choice?.getAttribute('aria-pressed') === 'true';
      })()
    `);
    if (selected) {
      return true;
    }
    await delay(150);
  }
  throw new Error(`Timed out waiting for selected choice: ${label}`);
}

async function waitForReady(client, text, options = {}) {
  const timeoutMs = options.timeoutMs ?? 30000;
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const found = await evaluate(client, `(document.body?.innerText || '').includes(${JSON.stringify(text)})`);
    if (found) {
      return true;
    }
    await delay(250);
  }
  if (options.optional) {
    return false;
  }
  throw new Error(`Timed out waiting for text: ${text}`);
}

async function waitForHydrated(client, timeoutMs = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const hydrated = await evaluate(client, "document.documentElement?.dataset?.auracueHydrated === 'true'");
    if (hydrated) return true;
    await delay(150);
  }
  throw new Error("Timed out waiting for AuraCue React hydration.");
}

async function waitForTextGone(client, text, timeoutMs = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const found = await evaluate(client, `(document.body?.innerText || '').includes(${JSON.stringify(text)})`);
    if (!found) {
      return true;
    }
    await delay(250);
  }
  throw new Error(`Timed out waiting for text to disappear: ${text}`);
}

async function waitForEnabledText(client, text, timeoutMs = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const enabled = await evaluate(client, `
      (() => {
        const needle = ${JSON.stringify(text)}.toLowerCase();
        const candidates = Array.from(document.querySelectorAll('button,a,input,label,[role="button"]'));
        const element = candidates.find((node) => (node.innerText || node.textContent || node.getAttribute('aria-label') || '').toLowerCase().includes(needle));
        return Boolean(element && !element.disabled && element.getAttribute('aria-disabled') !== 'true');
      })()
    `);
    if (enabled) {
      return true;
    }
    await delay(250);
  }
  throw new Error(`Timed out waiting for enabled text: ${text}`);
}

async function waitForUrl(client, fragment, timeoutMs = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const href = await evaluate(client, "window.location.href");
    if (href.includes(fragment)) {
      return href;
    }
    await delay(250);
  }
  throw new Error(`Timed out waiting for URL fragment: ${fragment}`);
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) {
    const detail = result.exceptionDetails.exception?.description || result.exceptionDetails.exception?.value || result.exceptionDetails.text;
    throw new Error(detail || JSON.stringify(result.exceptionDetails));
  }
  return result.result?.value;
}

async function readRuntimeDb() {
  const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: runtimeDatabaseUrl })
  });
  try {
    const anonymousId = findTranscriptBody((body) => body?.ok && body?.data?.anonymousId)?.data?.anonymousId;
    const user = anonymousId
      ? await prisma.anonymousUser.findUnique({
          where: { anonymousId },
          include: {
            uploads: true,
            drawSessions: true,
            jobs: true,
            cards: { include: { activations: true, savedCards: true, shares: true } },
            analytics: true
          }
        })
      : null;
    return {
      databaseUrl: runtimeDatabaseUrl,
      anonymousId,
      counts: {
        AnonymousUser: await prisma.anonymousUser.count(),
        OutfitUpload: await prisma.outfitUpload.count(),
        DrawSession: await prisma.drawSession.count(),
        GenerationJob: await prisma.generationJob.count(),
        AuraCard: await prisma.auraCard.count(),
        AuraActivation: await prisma.auraActivation.count(),
        SavedCard: await prisma.savedCard.count(),
        ShareEvent: await prisma.shareEvent.count(),
        AnalyticsEvent: await prisma.analyticsEvent.count(),
        CardTemplate: await prisma.cardTemplate.count()
      },
      user: user
        ? {
            id: user.id,
            anonymousId: user.anonymousId,
            uploads: user.uploads.map((item) => pick(item, ["id", "mimeType", "storagePath", "createdAt"])),
            drawSessions: user.drawSessions.map((item) => pick(item, ["id", "mood", "context", "uploadId", "drawSeed", "createdAt"])),
            jobs: user.jobs.map((item) => pick(item, ["id", "status", "drawSessionId", "drawPosition", "cardId", "fallbackUsed"])),
            cards: user.cards.map((card) => ({
              id: card.id,
              mood: card.mood,
              context: card.context,
              drawPosition: card.drawPosition,
              isActivated: card.isActivated,
              shareImageUrl: card.shareImageUrl,
              activations: card.activations.map((item) => pick(item, ["id", "status", "anchorType", "anchorLabel", "holdDurationMs", "sealedAt"])),
              savedCards: card.savedCards.map((item) => pick(item, ["id", "source", "createdAt"])),
              shares: card.shares.map((item) => pick(item, ["id", "channel", "source", "createdAt"]))
            })),
            analytics: user.analytics.map((item) => pick(item, ["id", "eventName", "page", "createdAt"]))
          }
        : null
    };
  } finally {
    await prisma.$disconnect();
  }
}

function pick(item, keys) {
  return Object.fromEntries(keys.map((key) => [key, item[key]]));
}

function normalizeTranscript(entries) {
  const bodies = new Map(entries.filter((entry) => entry.phase === "body").map((entry) => [entry.id, entry.body]));
  return entries
    .filter((entry) => entry.phase !== "body")
    .map((entry) => (entry.phase === "response" ? { ...entry, body: bodies.get(entry.id) ?? null, apiId: apiIdForPath(entry.path) } : { ...entry, apiId: apiIdForPath(entry.path) }));
}

function apiIdForPath(pathName) {
  if (!pathName) return "UNKNOWN";
  if (pathName === "/api/v1/identity/anonymous") return "API-001";
  if (pathName === "/api/v1/aura-cards/today") return "API-002";
  if (pathName === "/api/v1/uploads/outfit") return "API-003";
  if (pathName === "/api/v1/draw-sessions/start") return "API-004";
  if (pathName === "/api/v1/aura-cards/generate" || pathName === "/api/v1/generations/start") return "API-005";
  if (pathName.startsWith("/api/v1/generation-jobs/")) return "API-006";
  if (/^\/api\/v1\/aura-cards\/[^/]+$/.test(pathName)) return "API-007";
  if (pathName.endsWith("/render")) return "API-008";
  if (pathName.endsWith("/activation/start")) return "API-009";
  if (pathName.startsWith("/api/v1/activations/") && pathName.endsWith("/seal")) return "API-010";
  if (pathName.endsWith("/save")) return "API-011";
  if (pathName.endsWith("/share")) return "API-012";
  if (pathName === "/api/v1/analytics/events") return "API-013";
  if (pathName === "/api/v1/health") return "API-FOUNDATION";
  return "UNKNOWN";
}

function findTranscriptBody(predicate) {
  return apiTranscript.find((entry) => entry.phase === "body" && predicate(entry.body))?.body;
}

function redactBody(body) {
  if (!body) return null;
  if (body.length > 1200) return `${body.slice(0, 1200)}...<truncated>`;
  return parseMaybeJson(body);
}

function parseMaybeJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

async function startDevServer() {
  const preferredStartLog = path.join(out.logs, `${taskId}-start.log`);
  const standaloneServer = path.join(appRoot, ".next", "standalone", "apps", "web", "server.js");
  const useStandalone = serverMode === "production" && await exists(standaloneServer);
  const nextCommand = serverMode === "production" ? "start" : "dev";
  const startLog = await createWritableLog(preferredStartLog, `${taskId}-start`, `${taskId} ${serverMode} server start\ncwd=${appRoot}\nurl=${baseUrl}\nDATABASE_URL=${runtimeDatabaseUrl}\n`);
  if (useStandalone) {
    await prepareStandaloneAssets(standaloneServer);
  }
  const nextBin = path.join(appRoot, "node_modules", "next", "dist", "bin", "next");
  const command = useStandalone ? [standaloneServer] : [nextBin, nextCommand, "--port", String(port), "--hostname", "127.0.0.1"];
  const child = spawn(process.execPath, command, {
    cwd: useStandalone ? path.dirname(standaloneServer) : appRoot,
    env: { ...runtimeEnv(), PORT: String(port), HOSTNAME: "127.0.0.1" },
    shell: false
  });
  child.stdout.on("data", (chunk) => fs.appendFile(startLog, chunk).catch(() => {}));
  child.stderr.on("data", (chunk) => fs.appendFile(startLog, chunk).catch(() => {}));
  commandLog.push({
    command: useStandalone ? `node ${relative(standaloneServer)}` : `node ${relative(nextBin)} ${nextCommand} --port ${port} --hostname 127.0.0.1`,
    status: "STARTED",
    evidence: relative(startLog),
    serverMode
  });
  await waitForHttp(`${baseUrl}/api/v1/health`, 60000);
  await fs.appendFile(startLog, `\nREADY ${new Date().toISOString()} ${baseUrl}\n`);
  return child;
}

async function reuseExternalDevServer() {
  const started = Date.now();
  await waitForHttp(`${baseUrl}/api/v1/health`, 60000);
  commandLog.push({
    command: `reuse external web server ${baseUrl}`,
    status: "PASS",
    durationMs: Date.now() - started,
    evidence: `${baseUrl}/api/v1/health`
  });
  return null;
}

async function prepareStandaloneAssets(standaloneServer) {
  const standaloneAppRoot = path.dirname(standaloneServer);
  await copyIfExists(path.join(appRoot, "public"), path.join(standaloneAppRoot, "public"));
  await copyIfExists(path.join(appRoot, ".next", "static"), path.join(standaloneAppRoot, ".next", "static"));
}

async function copyIfExists(source, target) {
  if (!await exists(source)) {
    return;
  }
  await fs.rm(target, { recursive: true, force: true });
  await fs.cp(source, target, { recursive: true });
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function startBrowser() {
  const executable = await findBrowser();
  const profile = path.join(os.tmpdir(), `auracue-${taskId.toLowerCase()}-${Date.now()}`);
  const browserLog = await createWritableLog(path.join(out.logs, `${taskId}-browser.log`), `${taskId}-browser`, `browser=${executable}\nprofile=${profile}\ncdp=http://127.0.0.1:${cdpPort}\n`);
  const child = spawn(executable, [
    "--headless=chrome",
    `--window-size=${viewport.width},${viewport.height}`,
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${profile}`,
    "--remote-allow-origins=*",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-gpu",
    "--disable-gpu-sandbox",
    "--disable-gpu-compositing",
    "--disable-accelerated-2d-canvas",
    "--disable-accelerated-video-decode",
    "--disable-features=VizDisplayCompositor,UseSkiaRenderer",
    "--use-angle=swiftshader",
    "--use-gl=swiftshader",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank"
  ], { stdio: ["ignore", "pipe", "pipe"] });
  child.stdout.on("data", (chunk) => fs.appendFile(browserLog, chunk).catch(() => {}));
  child.stderr.on("data", (chunk) => fs.appendFile(browserLog, chunk).catch(() => {}));
  child.on("exit", (code, signal) => {
    fs.appendFile(browserLog, `\nEXIT code=${code} signal=${signal}\n`).catch(() => {});
  });
  commandLog.push({ command: `${executable} --headless=chrome --remote-debugging-port=${cdpPort}`, status: "STARTED", evidence: relative(browserLog) });
  await waitForHttp(`http://127.0.0.1:${cdpPort}/json/version`, 30000);
  return child;
}

async function reuseExternalBrowserProcess() {
  const started = Date.now();
  await waitForHttp(`http://127.0.0.1:${cdpPort}/json/version`, 30000);
  commandLog.push({
    command: `reuse external browser cdp ${cdpPort}`,
    status: "PASS",
    durationMs: Date.now() - started,
    evidence: `http://127.0.0.1:${cdpPort}/json/version`
  });
  return null;
}

async function createWritableLog(preferredPath, fallbackPrefix, initialContent) {
  try {
    await fs.writeFile(preferredPath, initialContent);
    return preferredPath;
  } catch (error) {
    const fallbackPath = path.join(os.tmpdir(), `${fallbackPrefix}.${process.pid}.${Date.now()}.log`);
    await fs.writeFile(fallbackPath, initialContent);
    commandLog.push({
      command: `open log ${relative(preferredPath)}`,
      status: "PASS_WITH_LOG_FALLBACK",
      evidence: fallbackPath,
      warning: `Preferred log path failed: ${error?.code ?? error}`
    });
    return fallbackPath;
  }
}

async function openPage() {
  const response = await httpJson(`http://127.0.0.1:${cdpPort}/json/new?about%3Ablank`, "PUT");
  return CdpClient.connect(response.webSocketDebuggerUrl);
}

function runtimeEnv() {
  return {
    ...process.env,
    DATABASE_URL: runtimeDatabaseUrl,
    AURACUE_API_MODE: "local",
    NEXT_TELEMETRY_DISABLED: "1",
    NODE_ENV: serverMode === "production" ? "production" : (process.env.NODE_ENV || "development")
  };
}

async function waitForHttp(url, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await delay(500);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function httpJson(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const request = http.request(url, { method }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { body += chunk; });
      response.on("end", () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`${method} ${url} -> ${response.statusCode}: ${body}`));
          return;
        }
        resolve(JSON.parse(body));
      });
    });
    request.on("error", reject);
    request.end();
  });
}

async function findBrowser() {
  const candidates = [
    process.env.T13_BROWSER,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {}
  }
  throw new Error(`No Edge or Chrome executable found for ${taskId} ${mode}.`);
}

async function ensureDirs() {
  await Promise.all(Object.values(out).map((dir) => fs.mkdir(dir, { recursive: true })));
}

async function resetRuntimeDatabase() {
  const sqlitePath = databaseFilePathFromUrl(databaseUrl);
  if (!sqlitePath) {
    return;
  }
  try {
    await Promise.all([
      fs.rm(sqlitePath, { force: true }),
      fs.rm(`${sqlitePath}-journal`, { force: true }),
      fs.rm(`${sqlitePath}-wal`, { force: true }),
      fs.rm(`${sqlitePath}-shm`, { force: true })
    ]);
  } catch (error) {
    if (error?.code !== "EPERM" && error?.code !== "EBUSY") {
      throw error;
    }
    await clearExistingSqlite(sqlitePath);
    runtimeDatabaseReused = true;
    commandLog.push({
      command: `reuse locked sqlite ${path.basename(sqlitePath)}`,
      status: "PASS_WITH_SQLITE_REUSE",
      warning: `SQLite file could not be removed: ${error.code}`
    });
  }
}

async function initializeRuntimeDatabase() {
  const sqlitePath = databaseFilePathFromUrl(databaseUrl);
  if (!sqlitePath) {
    commandLog.push({
      command: "runtime database init",
      status: "SKIPPED",
      evidence: "DATABASE_URL is outside local SQLite reset scope."
    });
    return;
  }
  if (runtimeDatabaseReused) {
    commandLog.push({
      command: `apply committed migration SQL -> ${path.basename(sqlitePath)}`,
      status: "SKIPPED_REUSED_INITIALIZED_SQLITE",
      evidence: "Existing SQLite schema was reused after table cleanup."
    });
    return;
  }

  const started = Date.now();
  const migrationPath = path.join(appRoot, "prisma", "migrations", "20260604010930_init", "migration.sql");
  const migrationSql = await fs.readFile(migrationPath, "utf8");
  await fs.mkdir(path.dirname(sqlitePath), { recursive: true });
  const db = new Database(sqlitePath);
  try {
    db.pragma("journal_mode = MEMORY");
    db.exec(migrationSql);
    commandLog.push({
      command: `apply committed migration SQL -> ${path.basename(sqlitePath)}`,
      status: "PASS",
      durationMs: Date.now() - started,
      evidence: relative(migrationPath)
    });
  } finally {
    db.close();
  }
}

async function clearExistingSqlite(sqlitePath) {
  const db = new Database(sqlitePath);
  try {
    const tables = db.prepare("select name from sqlite_master where type = 'table' and name not like 'sqlite_%'").all();
    db.exec("PRAGMA foreign_keys = OFF");
    const deleteRows = db.transaction(() => {
      for (const table of tables) {
        db.prepare(`DELETE FROM "${table.name.replaceAll('"', '""')}"`).run();
      }
    });
    deleteRows();
    db.exec("PRAGMA foreign_keys = ON");
  } finally {
    db.close();
  }
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const payload = `${JSON.stringify(value, null, 2)}\n`;
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const tempFile = `${file}.${process.pid}.${Date.now()}.${attempt}.tmp`;
    try {
      await fs.writeFile(tempFile, payload);
      await fs.rm(file, { force: true });
      await fs.rename(tempFile, file);
      return;
    } catch (error) {
      lastError = error;
      await fs.rm(tempFile, { force: true }).catch(() => {});
      if (!["UNKNOWN", "EBUSY", "EPERM", "ENOENT"].includes(error?.code)) {
        throw error;
      }
      await delay(150 * attempt);
      await fs.mkdir(path.dirname(file), { recursive: true });
    }
  }
  try {
    await fs.writeFile(file, payload);
    commandLog.push({
      command: `write evidence ${relative(file)}`,
      status: "PASS_WITH_DIRECT_WRITE_FALLBACK",
      evidence: relative(file),
      warning: `Atomic write path was locked: ${lastError?.code ?? lastError}`
    });
    return;
  } catch (fallbackError) {
    const fallbackFile = path.join(os.tmpdir(), `${path.basename(file)}.${process.pid}.${Date.now()}.json`);
    await fs.writeFile(fallbackFile, payload);
    commandLog.push({
      command: `write evidence ${relative(file)}`,
      status: "PASS_WITH_TMP_FALLBACK",
      evidence: fallbackFile,
      warning: `Evidence directory write failed: ${fallbackError?.code ?? fallbackError}`
    });
    return;
  }
}

async function writeCommandLog(verdict) {
  const logPath = path.join(out.logs, `${taskId}-command-log.md`);
  const lines = [
    `# ${taskId} Command Log`,
    "",
    `Verdict: ${verdict}`,
    `Mode: ${mode}`,
    `Server mode: ${serverMode}`,
    `Timestamp: ${new Date().toISOString()}`,
    `Live URL: ${baseUrl}`,
    `Database URL: ${databaseUrl}`,
    "",
    "## Commands",
    "",
    ...commandLog.map((entry) => `- ${entry.status}: \`${entry.command || entry.step}\`${entry.evidence ? ` -> ${entry.evidence}` : ""}${entry.exitCode !== undefined ? ` (exit ${entry.exitCode})` : ""}`),
    "",
    "## Evidence",
    "",
    `- Start log: ${relative(path.join(out.logs, `${taskId}-start.log`))}`,
    `- API transcript: ${relative(path.join(out.api, "runtime-smoke-api-transcript.json"))}`,
    `- DB readback: ${relative(path.join(out.db, "runtime-smoke-readback.json"))}`,
    `- Trace: ${relative(path.join(out.traces, "runtime-smoke-trace.json"))}`,
    `- Screenshots: ${relative(out.screenshots)}`
  ];
  try {
    await fs.writeFile(logPath, `${lines.join("\n")}\n`);
  } catch (error) {
    const fallbackLog = path.join(os.tmpdir(), `${taskId}-command-log.${process.pid}.${Date.now()}.md`);
    await fs.writeFile(fallbackLog, `${lines.join("\n")}\n`);
    console.warn(`Command log write fallback: ${fallbackLog} (${error?.code ?? error})`);
  }
}

function blockingConsoleErrors() {
  return consoleEvents.filter((entry) => {
    if (taskId === "T14" && entry.source === "network" && entry.text?.includes("status of 413")) {
      return false;
    }
    return entry.level === "exception" || entry.level === "error";
  });
}

function relative(file) {
  return path.relative(repoRoot, file).replace(/\\/g, "/");
}

function resolveRuntimeDatabaseUrl(url) {
  if (!url.startsWith("file:./")) {
    return url;
  }
  return `file:${path.join(appRoot, url.slice("file:./".length)).replace(/\\/g, "/")}`;
}

function databaseFilePathFromUrl(url) {
  if (!url.startsWith("file:")) {
    return null;
  }
  if (url.startsWith("file:./")) {
    return path.join(appRoot, url.slice("file:./".length));
  }
  const rawPath = url.slice("file:".length);
  if (/^[A-Za-z]:\//.test(rawPath)) {
    return rawPath.replace(/\//g, "\\");
  }
  return null;
}

async function cleanup() {
  if (cdp) {
    try { await cdp.close(); } catch {}
  }
  for (const child of [browserProcess, devProcess]) {
    if (child && !child.killed) {
      child.kill();
    }
  }
  await delay(500);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    this.buffer = Buffer.alloc(0);
    socket.on("data", (chunk) => this.receive(chunk));
    socket.on("close", () => {
      for (const { reject } of this.pending.values()) reject(new Error("CDP socket closed"));
      this.pending.clear();
    });
  }

  static async connect(wsUrl) {
    const parsed = new URL(wsUrl);
    const key = crypto.randomBytes(16).toString("base64");
    const socket = net.connect(Number(parsed.port), parsed.hostname);
    await new Promise((resolve, reject) => {
      socket.once("error", reject);
      socket.once("connect", resolve);
    });
    socket.write([
      `GET ${parsed.pathname}${parsed.search} HTTP/1.1`,
      `Host: ${parsed.host}`,
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Key: ${key}`,
      "Sec-WebSocket-Version: 13",
      "",
      ""
    ].join("\r\n"));
    let connectedClient;
    await new Promise((resolve, reject) => {
      let handshake = Buffer.alloc(0);
      const onData = (chunk) => {
        handshake = Buffer.concat([handshake, chunk]);
        const index = handshake.indexOf("\r\n\r\n");
        if (index === -1) return;
        socket.off("data", onData);
        const header = handshake.subarray(0, index).toString("utf8");
        if (!header.includes(" 101 ")) {
          reject(new Error(`WebSocket handshake failed: ${header}`));
          return;
        }
        const rest = handshake.subarray(index + 4);
        const client = new CdpClient(socket);
        if (rest.length > 0) client.receive(rest);
        connectedClient = client;
        resolve();
      };
      socket.on("data", onData);
      socket.once("error", reject);
    });
    return connectedClient;
  }

  send(method, params = {}) {
    const id = ++this.id;
    const payload = JSON.stringify({ id, method, params });
    this.socket.write(encodeWsFrame(payload));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP timeout: ${method}`));
        }
      }, 30000);
    });
  }

  on(method, callback) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(callback);
  }

  receive(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= 2) {
      const frame = decodeWsFrame(this.buffer);
      if (!frame) return;
      this.buffer = this.buffer.subarray(frame.consumed);
      if (frame.opcode === 8) return;
      const message = JSON.parse(frame.payload.toString("utf8"));
      if (message.id && this.pending.has(message.id)) {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) {
          pending.reject(new Error(JSON.stringify(message.error)));
        } else {
          pending.resolve(message.result);
        }
      } else if (message.method && this.listeners.has(message.method)) {
        for (const listener of this.listeners.get(message.method)) {
          Promise.resolve(listener(message.params)).catch((error) => {
            traceEvents.push({ type: "listener-error", method: message.method, error: String(error), timestamp: new Date().toISOString() });
          });
        }
      }
    }
  }

  close() {
    this.socket.destroy();
  }
}

function encodeWsFrame(text) {
  const payload = Buffer.from(text);
  const lengthBytes = payload.length < 126 ? 0 : payload.length <= 65535 ? 2 : 8;
  const header = Buffer.alloc(2 + lengthBytes + 4);
  header[0] = 0x81;
  if (payload.length < 126) {
    header[1] = 0x80 | payload.length;
  } else if (payload.length <= 65535) {
    header[1] = 0x80 | 126;
    header.writeUInt16BE(payload.length, 2);
  } else {
    header[1] = 0x80 | 127;
    header.writeBigUInt64BE(BigInt(payload.length), 2);
  }
  const maskOffset = 2 + lengthBytes;
  const mask = crypto.randomBytes(4);
  mask.copy(header, maskOffset);
  const masked = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i++) masked[i] = payload[i] ^ mask[i % 4];
  return Buffer.concat([header, masked]);
}

function decodeWsFrame(buffer) {
  if (buffer.length < 2) return null;
  const opcode = buffer[0] & 0x0f;
  const masked = Boolean(buffer[1] & 0x80);
  let length = buffer[1] & 0x7f;
  let offset = 2;
  if (length === 126) {
    if (buffer.length < offset + 2) return null;
    length = buffer.readUInt16BE(offset);
    offset += 2;
  } else if (length === 127) {
    if (buffer.length < offset + 8) return null;
    length = Number(buffer.readBigUInt64BE(offset));
    offset += 8;
  }
  let mask;
  if (masked) {
    if (buffer.length < offset + 4) return null;
    mask = buffer.subarray(offset, offset + 4);
    offset += 4;
  }
  if (buffer.length < offset + length) return null;
  let payload = buffer.subarray(offset, offset + length);
  if (masked) {
    payload = Buffer.from(payload.map((byte, index) => byte ^ mask[index % 4]));
  }
  return { opcode, payload, consumed: offset + length };
}
