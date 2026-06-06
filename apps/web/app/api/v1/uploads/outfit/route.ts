import type { ApiErrorCode } from "@/server/api/envelope";
import { createRequestContext, jsonError, jsonOk } from "@/server/api/envelope";
import { createIdentityUploadDrawService } from "@/server/services/identity-upload-draw";

export async function POST(request: Request) {
  const context = createRequestContext(request);
  const formData = await request.formData();
  const file = formData.get("file");
  const result = await createIdentityUploadDrawService().createOutfitUpload({
    anonymousId: formData.get("anonymousId"),
    platform: formData.get("platform"),
    file: file instanceof File
      ? {
          name: file.name,
          type: file.type,
          size: file.size
        }
      : null
  });

  if (!result.ok) {
    return jsonError(context, result.status, result.code as ApiErrorCode, result.message, result.details);
  }

  return jsonOk(context, result.data);
}
