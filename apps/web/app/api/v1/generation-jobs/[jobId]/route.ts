import { createRequestContext, jsonError, jsonOk } from "@/server/api/envelope";
import { createGenerationService } from "@/server/services/generation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const context = createRequestContext(request);
  const url = new URL(request.url);
  const { jobId } = await params;
  const result = await createGenerationService().getGenerationJob({
    jobId,
    anonymousId: url.searchParams.get("anonymousId")
  });

  if (!result.ok) {
    return jsonError(context, result.status, result.code, result.message, result.details);
  }

  return jsonOk(context, result.data);
}
