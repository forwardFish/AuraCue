import assert from "node:assert/strict";
import { AuraCueApiError, createApiClient } from "../../lib/api-client.js";
import { analyticsEventNames, track } from "../../lib/analytics.js";

const calls = [];
const client = createApiClient({
  baseUrl: "https://example.test/",
  fetchImpl: async (url, init) => {
    calls.push({ url, init });
    if (url.endsWith("/fail")) {
      return jsonResponse(400, {
        ok: false,
        requestId: "req_1",
        error: { code: "VALIDATION_ERROR", message: "Bad input.", details: { field: "mood" } }
      });
    }
    return jsonResponse(200, {
      ok: true,
      requestId: "req_2",
      data: { url, method: init.method }
    });
  }
});

assert.deepEqual(await client.get("/api/v1/health"), {
  url: "https://example.test/api/v1/health",
  method: "GET"
});
assert.deepEqual(await client.createAnonymousIdentity({ platform: "web" }), {
  url: "https://example.test/api/v1/identity/anonymous",
  method: "POST"
});
assert.equal(calls.at(-1).init.headers.get("content-type"), "application/json");

await assert.rejects(
  () => client.post("/fail", {}),
  (error) => {
    assert.ok(error instanceof AuraCueApiError);
    assert.equal(error.status, 400);
    assert.equal(error.code, "VALIDATION_ERROR");
    assert.equal(error.requestId, "req_1");
    return true;
  }
);

const networkClient = createApiClient({
  fetchImpl: async () => {
    throw new Error("socket closed");
  }
});
await assert.rejects(
  () => networkClient.get("/api/v1/health"),
  (error) => {
    assert.equal(error.code, "NETWORK_ERROR");
    assert.equal(error.message, "Network request failed. Please retry.");
    return true;
  }
);

const analyticsCalls = [];
const analyticsClient = {
  recordAnalytics: async (event) => {
    analyticsCalls.push(event);
    return { analyticsEventId: "ae_1" };
  }
};
await track("select_mood", { mood: "calm", apiKey: "redacted" }, {
  client: analyticsClient,
  page: "/",
  anonymousId: "anon_1"
});
assert.equal(analyticsCalls[0].eventName, "select_mood");
assert.equal(analyticsCalls[0].payload.apiKey, undefined);
assert.ok(analyticsEventNames.includes("activation_sealed"));

const skipped = await track("unknown_event", {}, { client: analyticsClient });
assert.deepEqual(skipped, { skipped: true, reason: "event_not_allowed" });

console.log(JSON.stringify({
  status: "PASS",
  suite: "api-client",
  checked: ["success envelope", "error envelope", "network error", "analytics whitelist"]
}, null, 2));

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" }
  });
}
