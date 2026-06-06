import { createRequestContext, jsonError, jsonOk, readJsonBody } from "@/server/api/envelope";
import { createCardActivationShareService } from "@/server/services/card-activation-share";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const context = createRequestContext(request);
  const { cardId } = await params;
  const body = await readJsonBody(request);
  if (!body.ok) {
    return jsonError(context, 400, "INVALID_JSON", "Request body must be valid JSON.", { digest: body.digest });
  }
  const result = await createCardActivationShareService().shareCard({ ...body.body, cardId });
  if (!result.ok) {
    return jsonError(context, result.status, result.code, result.message, result.details);
  }
  return jsonOk(context, result.data);
}
