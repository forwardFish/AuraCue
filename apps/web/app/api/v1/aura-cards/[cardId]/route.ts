import { createRequestContext, jsonError, jsonOk } from "@/server/api/envelope";
import { createCardActivationShareService } from "@/server/services/card-activation-share";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const context = createRequestContext(request);
  const { cardId } = await params;
  const result = await createCardActivationShareService().getCard({ cardId });
  if (!result.ok) {
    return jsonError(context, result.status, result.code, result.message, result.details);
  }
  return jsonOk(context, result.data);
}
