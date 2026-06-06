import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { redactSecretLikeValues } from "./redaction";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "FORBIDDEN"
  | "INTERNAL_ERROR"
  | "INVALID_JSON"
  | "METHOD_NOT_ALLOWED"
  | "NOT_FOUND"
  | "HOLD_TOO_SHORT"
  | "ACTIVATION_ALREADY_COMPLETED"
  | "VALIDATION_ERROR";

export type ApiRequestContext = {
  requestId: string;
  method: string;
  path: string;
  runtime: "local-web-api";
};

export type ApiErrorEnvelope = {
  ok: false;
  requestId: string;
  error: {
    code: ApiErrorCode;
    message: string;
    details: Record<string, unknown>;
  };
};

export type ApiSuccessEnvelope<T> = {
  ok: true;
  requestId: string;
  data: T;
};

export function createRequestContext(request: Request): ApiRequestContext {
  const url = new URL(request.url);
  return {
    requestId: request.headers.get("x-request-id") ?? randomUUID(),
    method: request.method,
    path: url.pathname,
    runtime: "local-web-api"
  };
}

export function jsonOk<T>(context: ApiRequestContext, data: T, init: ResponseInit = {}) {
  return NextResponse.json<ApiSuccessEnvelope<T>>(
    {
      ok: true,
      requestId: context.requestId,
      data: redactSecretLikeValues(data) as T
    },
    init
  );
}

export function jsonError(
  context: ApiRequestContext,
  status: number,
  code: ApiErrorCode,
  message: string,
  details: Record<string, unknown> = {}
) {
  return NextResponse.json<ApiErrorEnvelope>(
    {
      ok: false,
      requestId: context.requestId,
      error: {
        code,
        message,
        details: redactSecretLikeValues(details) as Record<string, unknown>
      }
    },
    { status }
  );
}

export async function readJsonBody<T extends Record<string, unknown>>(request: Request) {
  const raw = await request.text();
  if (raw.trim() === "") {
    return { ok: true as const, body: {} as T };
  }

  try {
    return { ok: true as const, body: JSON.parse(raw) as T };
  } catch {
    const digest = createHash("sha256").update(raw).digest("hex").slice(0, 12);
    return { ok: false as const, digest };
  }
}
