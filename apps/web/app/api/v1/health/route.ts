import { createRequestContext, jsonOk } from "@/server/api/envelope";
import { requireLocalOnly } from "@/server/api/local-guard";
import { getWebApiConfig } from "@/server/config/env";
import { p0ModelNames } from "@/server/repositories/readback";

export async function GET(request: Request) {
  const context = createRequestContext(request);
  const guard = requireLocalOnly(request, context);
  if (guard) {
    return guard;
  }

  return jsonOk(context, {
    status: "ready",
    foundation: "api-v1-route-handler",
    apiBase: "/api/v1",
    config: getWebApiConfig(),
    database: {
      orm: "prisma",
      validationStrategy: "local SQLite via Prisma 7",
      p0Models: p0ModelNames
    },
    localOnly: {
      liveServiceWritesAllowed: false,
      secretsReturned: false
    }
  });
}
