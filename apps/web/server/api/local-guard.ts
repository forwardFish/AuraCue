import type { ApiRequestContext } from "./envelope";
import { jsonError } from "./envelope";

const allowedHosts = new Set(["127.0.0.1", "localhost", "::1"]);

export function isLocalRequest(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
  const hostname = host.split(":")[0]?.toLowerCase();
  return Boolean(hostname && allowedHosts.has(hostname));
}

export function requireLocalOnly(request: Request, context: ApiRequestContext) {
  if (isLocalRequest(request)) {
    return null;
  }

  return jsonError(context, 403, "FORBIDDEN", "This route is available only in local Web API validation.", {
    boundary: "local-only",
    liveServiceWritesAllowed: false
  });
}
