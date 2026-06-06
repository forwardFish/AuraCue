import { apiClient } from "./api-client.js";

export const analyticsEventNames = [
  "select_mood",
  "click_start_card",
  "select_context",
  "skip_context",
  "upload_outfit_success",
  "upload_outfit_failed",
  "skip_upload",
  "draw_session_started",
  "draw_card_selected",
  "generation_started",
  "generation_completed",
  "generation_failed",
  "view_result",
  "activation_started",
  "activation_hold_cancelled",
  "activation_sealed",
  "card_saved",
  "share_opened",
  "share_completed"
];

export function track(eventName, payload = {}, options = {}) {
  if (!analyticsEventNames.includes(eventName)) {
    return Promise.resolve({ skipped: true, reason: "event_not_allowed" });
  }
  const client = options.client || apiClient;
  const event = {
    eventName,
    page: options.page || currentPage(),
    platform: "web",
    anonymousId: options.anonymousId || null,
    payload: sanitizePayload(payload)
  };

  return Promise.resolve()
    .then(() => client.recordAnalytics(event))
    .catch((error) => {
      options.onError?.(error);
      return { skipped: true, reason: "analytics_failed" };
    });
}

function currentPage() {
  return typeof window === "undefined" ? "server" : window.location.pathname;
}

function sanitizePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !/secret|token|password|api[-_]?key/i.test(key))
  );
}
