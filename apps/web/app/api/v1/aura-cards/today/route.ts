import type { ApiErrorCode } from "@/server/api/envelope";
import { createRequestContext, jsonError, jsonOk } from "@/server/api/envelope";
import { createIdentityUploadDrawService } from "@/server/services/identity-upload-draw";

export async function GET(request: Request) {
  const context = createRequestContext(request);
  const url = new URL(request.url);
  const result = await createIdentityUploadDrawService().getTodayCard({
    anonymousId: url.searchParams.get("anonymousId"),
    timezone: url.searchParams.get("timezone")
  });

  if (!result.ok) {
    return jsonError(context, result.status, result.code as ApiErrorCode, result.message, result.details);
  }

  return jsonOk(context, result.data);
}
