import {
  analyticsEventCoverage,
  analyticsEvents,
  implementationAnalyticsEvents,
  prdRequiredAnalyticsEvents
} from "./events.mjs";

export {
  analyticsEventCoverage,
  analyticsEvents,
  implementationAnalyticsEvents,
  prdRequiredAnalyticsEvents
};

export function isKnownAnalyticsEvent(eventName) {
  return analyticsEvents.includes(eventName);
}

export function missingRequiredAnalyticsEvents(eventNames) {
  const seen = new Set(eventNames);
  return prdRequiredAnalyticsEvents.filter((eventName) => !seen.has(eventName));
}
