import { analyticsEvents } from "./events.mjs";

export { analyticsEvents };

export function validateAnalyticsEventInput(body) {
  const details = {};
  if (!analyticsEvents.includes(body?.eventName)) {
    details.eventName = `Expected one of: ${analyticsEvents.join(", ")}`;
  }
  if (typeof body?.page !== "string" || body.page.trim() === "" || !body.page.startsWith("/")) {
    details.page = "Expected a local mini-program route path.";
  }
  const properties = body?.properties ?? {};
  if (typeof properties !== "object" || properties === null || Array.isArray(properties)) {
    details.properties = "Expected a flat object with safe primitive values.";
  } else {
    for (const [key, value] of Object.entries(properties)) {
      if (!/^[a-zA-Z0-9_.-]{1,64}$/.test(key)) {
        details[`properties.${key}`] = "Property keys must be stable analytics-safe identifiers.";
      }
      if (value !== null && !["string", "number", "boolean"].includes(typeof value)) {
        details[`properties.${key}`] = "Property values must be string, number, boolean, or null.";
      }
      if (/token|secret|password|credential/i.test(key)) {
        details[`properties.${key}`] = "Secret-like analytics properties are not allowed.";
      }
    }
  }
  return Object.keys(details).length === 0 ? null : details;
}
