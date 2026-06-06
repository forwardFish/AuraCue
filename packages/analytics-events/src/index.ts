export const analyticsEvents = [
  "page_view_home",
  "click_generate_start",
  "select_scene",
  "select_energy",
  "generation_started",
  "generation_success",
  "generation_failed",
  "view_result_free",
  "click_unlock",
  "checkout_started",
  "checkout_success",
  "save_card",
  "share_card",
  "copy_share_link",
  "invite_started",
  "invite_completed",
  "return_next_day",
  "page_view_scene_selection",
  "page_view_energy_selection",
  "blocked_continue_scene",
  "click_scene_continue",
  "blocked_generate_incomplete_selection",
  "click_generate_card",
  "page_view_generation_loading",
  "poll_generation_job",
  "page_view_generation_error",
  "click_generation_retry",
  "click_generation_change_scene",
  "page_view_free_preview",
  "click_invite_unlock_entry",
  "click_preview_share_locked",
  "page_view_unlock_choice",
  "click_paid_unlock_entry",
  "click_invite_instead",
  "page_view_invite_start",
  "click_invite_friends",
  "click_invite_paid_unlock",
  "page_view_invite_progress",
  "click_copy_invite_link",
  "click_invite_again",
  "click_invite_how_it_works",
  "page_view_invite_landing",
  "click_friend_generate_card",
  "page_view_mock_payment_confirm",
  "mock_payment_started",
  "mock_payment_completed",
  "page_view_mock_payment_failed",
  "click_restore_purchase",
  "click_payment_invite_instead",
  "click_payment_contact_support",
  "page_view_mock_payment_success",
  "click_view_full_card_after_payment",
  "click_share_story_after_payment",
  "page_view_full_result",
  "click_save_card",
  "click_share_story",
  "click_more_sharing_options",
  "click_view_7_day_trend_disabled",
  "page_view_share",
  "page_view_share_story",
  "page_view_share_channels",
  "share_started",
  "share_channel_selected",
  "share_image_rendered",
  "click_close_share_preview",
  "click_save_story_card",
  "click_share_story_card",
  "click_copy_story_link",
  "click_share_channel",
  "click_cancel_share_channels",
  "card_saved",
  "page_view_save_success",
  "save_success_viewed",
  "click_save_success_share_now",
  "click_save_success_back_home",
  "click_view_saved_card",
  "activation_page_view",
  "activation_anchor_selected",
  "activation_started",
  "activation_hold_started",
  "activation_hold_cancelled",
  "activation_hold_completed",
  "aura_activated",
  "share_preview_view",
  "render_failed",
  "select_mood",
  "click_start_card",
  "select_context",
  "skip_context",
  "upload_outfit_success",
  "upload_outfit_failed",
  "skip_upload",
  "draw_session_started",
  "draw_card_selected",
  "generation_completed",
  "view_result",
  "activation_hold_cancelled",
  "activation_sealed",
  "share_opened",
  "share_completed"
] as const;

export type AnalyticsEventName = (typeof analyticsEvents)[number];

export type AnalyticsEventProperties = Record<string, string | number | boolean | null>;

export const prdRequiredAnalyticsEvents = [
  "page_view_home",
  "click_generate_start",
  "select_scene",
  "select_energy",
  "generation_started",
  "generation_success",
  "generation_failed",
  "view_result_free",
  "click_unlock",
  "checkout_started",
  "checkout_success",
  "save_card",
  "share_card",
  "copy_share_link",
  "invite_started",
  "invite_completed",
  "return_next_day"
] as const;

export function validateAnalyticsEventInput(body: {
  eventName?: unknown;
  page?: unknown;
  payload?: unknown;
}) {
  const details: Record<string, string> = {};
  if (!analyticsEvents.includes(body.eventName as AnalyticsEventName)) {
    details.eventName = "Expected a supported AuraCue analytics event name.";
  }
  if (typeof body.page !== "string" || body.page.trim() === "" || !body.page.startsWith("/")) {
    details.page = "Expected a local route path starting with '/'.";
  }
  const payload = body.payload ?? {};
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    details.payload = "Expected a flat object with safe primitive values.";
  } else {
    for (const [key, value] of Object.entries(payload)) {
      if (!/^[a-zA-Z0-9_.-]{1,64}$/.test(key)) {
        details[`payload.${key}`] = "Payload keys must be stable analytics-safe identifiers.";
      }
      if (value !== null && !["string", "number", "boolean"].includes(typeof value)) {
        details[`payload.${key}`] = "Payload values must be string, number, boolean, or null.";
      }
      if (/token|secret|password|credential|authorization|cookie/i.test(key)) {
        details[`payload.${key}`] = "Secret-like analytics payload keys are not allowed.";
      }
      if (typeof value === "string" && /(sk-[a-z0-9_-]{8,}|bearer\s+[a-z0-9._-]+|client_secret)/i.test(value)) {
        details[`payload.${key}`] = "Secret-like analytics payload values are not allowed.";
      }
    }
  }
  return Object.keys(details).length === 0 ? null : details;
}
