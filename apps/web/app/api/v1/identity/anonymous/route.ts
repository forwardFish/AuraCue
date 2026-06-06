import type { ApiErrorCode } from "@/server/api/envelope";
import { createRequestContext, jsonError, jsonOk, readJsonBody } from "@/server/api/envelope";
import { createIdentityUploadDrawService } from "@/server/services/identity-upload-draw";

export async function POST(request: Request) {
  const context = createRequestContext(request);
  const body = await readJsonBody(request);
  if (!body.ok) {
    return jsonError(context, 400, "INVALID_JSON", "Request body must be valid JSON.", { digest: body.digest });
  }

  const result = await createIdentityUploadDrawService().createAnonymousIdentity(body.body);
  if (!result.ok) {
    return jsonError(context, result.status, result.code as ApiErrorCode, result.message, result.details);
  }

  return jsonOk(context, result.data);
}
