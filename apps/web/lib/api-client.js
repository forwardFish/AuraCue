export class AuraCueApiError extends Error {
  constructor({ status, code, message, requestId, details }) {
    super(message || "AuraCue API request failed.");
    this.name = "AuraCueApiError";
    this.status = status;
    this.code = code || "API_ERROR";
    this.requestId = requestId || null;
    this.details = details || {};
  }
}

export function createApiClient(options = {}) {
  const baseUrl = (options.baseUrl || "").replace(/\/$/, "");
  const fetchImpl = options.fetchImpl || globalThis.fetch?.bind(globalThis);
  if (!fetchImpl) {
    throw new Error("A fetch implementation is required.");
  }

  const client = {
    async request(path, init = {}) {
      const response = await safeFetch(fetchImpl, `${baseUrl}${path}`, {
        ...init,
        headers: buildHeaders(init.headers, init.body)
      });
      const envelope = await parseEnvelope(response);
      if (!envelope.ok) {
        throw new AuraCueApiError({
          status: response.status,
          code: envelope.error?.code,
          message: envelope.error?.message,
          requestId: envelope.requestId,
          details: envelope.error?.details
        });
      }
      return envelope.data;
    },
    get(path) {
      return this.request(path, { method: "GET" });
    },
    post(path, body) {
      return this.request(path, {
        method: "POST",
        body: JSON.stringify(body ?? {})
      });
    },
    postForm(path, formData) {
      return this.request(path, {
        method: "POST",
        body: formData
      });
    },
    createAnonymousIdentity(input) {
      return this.post("/api/v1/identity/anonymous", input);
    },
    getTodayCard(input) {
      const query = toQuery(input);
      return this.get(`/api/v1/aura-cards/today${query}`);
    },
    getHomeContent() {
      return this.get("/api/v1/home");
    },
    uploadOutfit(input) {
      const formData = new FormData();
      formData.set("anonymousId", input.anonymousId);
      formData.set("platform", input.platform || "web");
      formData.set("file", input.file);
      return this.postForm("/api/v1/uploads/outfit", formData);
    },
    startDrawSession(input) {
      return this.post("/api/v1/draw-sessions/start", input);
    },
    startGeneration(input) {
      return this.post("/api/v1/generations/start", input);
    },
    generateAuraCard(input) {
      return this.post("/api/v1/aura-cards/generate", input);
    },
    getGenerationJob(jobId, input = {}) {
      return this.get(`/api/v1/generation-jobs/${encodeURIComponent(jobId)}${toQuery(input)}`);
    },
    getAuraCard(cardId) {
      return this.get(`/api/v1/aura-cards/${encodeURIComponent(cardId)}`);
    },
    renderAuraCard(cardId, input) {
      return this.post(`/api/v1/aura-cards/${encodeURIComponent(cardId)}/render`, input);
    },
    startActivation(cardId, input) {
      return this.post(`/api/v1/aura-cards/${encodeURIComponent(cardId)}/activation/start`, input);
    },
    sealActivation(activationId, input) {
      return this.post(`/api/v1/activations/${encodeURIComponent(activationId)}/seal`, input);
    },
    saveCard(cardId, input) {
      return this.post(`/api/v1/aura-cards/${encodeURIComponent(cardId)}/save`, input);
    },
    shareCard(cardId, input) {
      return this.post(`/api/v1/aura-cards/${encodeURIComponent(cardId)}/share`, input);
    },
    recordAnalytics(input) {
      return this.post("/api/v1/analytics/events", input);
    }
  };

  return client;
}

export const apiClient = createApiClient();

async function safeFetch(fetchImpl, url, init) {
  try {
    return await fetchImpl(url, init);
  } catch {
    throw new AuraCueApiError({
      status: 0,
      code: "NETWORK_ERROR",
      message: "Network request failed. Please retry.",
      details: {}
    });
  }
}

async function parseEnvelope(response) {
  const text = await response.text();
  let envelope;
  try {
    envelope = text ? JSON.parse(text) : null;
  } catch {
    throw new AuraCueApiError({
      status: response.status,
      code: "INVALID_RESPONSE",
      message: "API response could not be parsed.",
      details: {}
    });
  }
  if (!envelope || typeof envelope !== "object" || typeof envelope.ok !== "boolean") {
    throw new AuraCueApiError({
      status: response.status,
      code: "INVALID_ENVELOPE",
      message: "API response envelope is invalid.",
      details: {}
    });
  }
  return envelope;
}

function buildHeaders(headers, body) {
  const nextHeaders = new Headers(headers || {});
  if (!(body instanceof FormData) && !nextHeaders.has("content-type")) {
    nextHeaders.set("content-type", "application/json");
  }
  nextHeaders.set("accept", "application/json");
  return nextHeaders;
}

function toQuery(input) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input || {})) {
    if (value !== null && value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}
