import type { ApiErrorCode } from "../api/envelope";
import { generateAuraCardWithFallback } from "../ai/provider";
import { Prisma } from "@prisma/client";
import { asRecord, normalizeGenerationInput } from "../ai/schemas";
import type { AuraGenerationInput, AuraGenerationPromptInput } from "../ai/schemas";
import {
  createGenerationRepository,
  type GenerationJobWithCardRecord,
  type GenerationRepository
} from "../repositories/generation-repository";

export type GenerationFailure = {
  ok: false;
  status: number;
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
};

type GenerationSuccess<T> = {
  ok: true;
  data: T;
};

type GenerationResult<T> = GenerationSuccess<T> | GenerationFailure;

export class GenerationService {
  constructor(private readonly repository: GenerationRepository = createGenerationRepository()) {}

  async startGeneration(body: Record<string, unknown>): Promise<GenerationResult<{
    jobId: string;
    status: string;
    cardId: string | null;
    generationSource: "ai" | "local-fallback";
    fallbackUsed: boolean;
    provider: string;
  }>> {
    const input = normalizeGenerationInput(body);
    if ("error" in input) {
      return validationError(input.error.message, input.error.details);
    }

    const user = await this.repository.findUserByAnonymousId(input.anonymousId);
    if (!user) {
      return notFound("Anonymous user was not found.", { anonymousId: input.anonymousId });
    }

    const drawSession = await this.repository.findDrawSessionForUser({
      drawSessionId: input.drawSessionId,
      userId: user.id
    });
    if (!drawSession) {
      return notFound("Draw session was not found for this anonymous user.", { drawSessionId: input.drawSessionId });
    }
    if (drawSession.expiresAt.getTime() <= Date.now()) {
      return validationError("Draw session has expired.", { drawSessionId: drawSession.id, expiresAt: drawSession.expiresAt.toISOString() });
    }
    if (!hasDrawPosition(drawSession.cardOptions, input.drawPosition)) {
      return validationError("drawPosition is not available for this draw session.", {
        drawSessionId: drawSession.id,
        drawPosition: input.drawPosition
      });
    }

    const existing = await this.repository.findJobByDrawSelection({
      drawSessionId: drawSession.id,
      drawPosition: input.drawPosition
    });
    if (existing) {
      return { ok: true, data: toJobResponse(existing) };
    }

    const promptInput = buildPromptInput(input, drawSession);
    const providerResult = await generateAuraCardWithFallback(promptInput);
    const job = await this.repository.createSuccessfulGeneration({
      userId: user.id,
      drawSessionId: drawSession.id,
      drawPosition: input.drawPosition,
      provider: providerResult.provider,
      fallbackUsed: providerResult.fallbackUsed,
      uploadId: drawSession.uploadId,
      mood: drawSession.mood,
      context: drawSession.context,
      drawSeed: drawSession.drawSeed,
      content: providerResult.content as Prisma.InputJsonObject
    });

    return { ok: true, data: toJobResponse(job) };
  }

  async getGenerationJob(input: {
    jobId?: string | null;
    anonymousId?: string | null;
  }): Promise<GenerationResult<{
    jobId: string;
    status: string;
    cardId: string | null;
    error: { code: string; message: string } | null;
    generationSource: "ai" | "local-fallback";
    fallbackUsed: boolean;
    provider: string;
  }>> {
    if (!input.jobId) {
      return validationError("jobId is required.", { field: "jobId" });
    }
    const job = await this.repository.findJobById(input.jobId);
    if (!job) {
      return notFound("Generation job was not found.", { jobId: input.jobId });
    }

    if (input.anonymousId) {
      const user = await this.repository.findUserByAnonymousId(input.anonymousId);
      if (!user || user.id !== job.userId) {
        return notFound("Generation job was not found for this anonymous user.", { jobId: input.jobId });
      }
    }

    const response = toJobResponse(job);
    return {
      ok: true,
      data: {
        ...response,
        error: job.errorCode ? { code: job.errorCode, message: "Generation did not complete." } : null
      }
    };
  }
}

export function createGenerationService(repository?: GenerationRepository) {
  return new GenerationService(repository);
}

function buildPromptInput(
  input: AuraGenerationInput,
  drawSession: NonNullable<Awaited<ReturnType<GenerationRepository["findDrawSessionForUser"]>>>
): AuraGenerationPromptInput {
  const context = drawSession.context;
  return {
    ...input,
    mood: drawSession.mood,
    context,
    drawSeed: drawSession.drawSeed,
    scene: inferScene(context),
    energy: inferEnergy(drawSession.mood),
    uploadStyleNotes: drawSession.upload ? asRecord(drawSession.upload.styleNotes) : null
  };
}

function inferScene(context: string | null) {
  const normalized = (context ?? "").toLowerCase();
  if (normalized.includes("date") || normalized.includes("romantic")) {
    return "date";
  }
  if (normalized.includes("party") || normalized.includes("social")) {
    return "party";
  }
  if (normalized.includes("work") || normalized.includes("meeting") || normalized.includes("interview")) {
    return "work";
  }
  return "luck";
}

function inferEnergy(mood: string) {
  const normalized = mood.toLowerCase();
  if (["confidence", "confident"].includes(normalized)) {
    return "confidence";
  }
  if (["calm", "luck", "love", "charm", "focus"].includes(normalized)) {
    return normalized;
  }
  if (normalized.includes("romantic")) {
    return "love";
  }
  if (normalized.includes("magnetic")) {
    return "charm";
  }
  return "calm";
}

function hasDrawPosition(cardOptions: unknown, drawPosition: number) {
  return Array.isArray(cardOptions) && cardOptions.some((item) => {
    const record = asRecord(item);
    return record.position === drawPosition;
  });
}

function toJobResponse(job: NonNullable<GenerationJobWithCardRecord>) {
  const content = asRecord(job.card?.content);
  return {
    jobId: job.id,
    status: job.status,
    cardId: job.resultCardId ?? job.card?.id ?? null,
    generationSource: content.generationSource === "ai" ? "ai" as const : "local-fallback" as const,
    fallbackUsed: job.fallbackUsed,
    provider: job.provider
  };
}

function validationError(message: string, details: Record<string, unknown>): GenerationFailure {
  return { ok: false, status: 400, code: "VALIDATION_ERROR", message, details };
}

function notFound(message: string, details: Record<string, unknown>): GenerationFailure {
  return { ok: false, status: 404, code: "NOT_FOUND", message, details };
}
