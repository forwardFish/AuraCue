import { createHash, randomUUID } from "node:crypto";
import type { ApiErrorCode } from "../api/envelope";
import {
  createIdentityUploadDrawRepository,
  type IdentityUploadDrawRepository
} from "../repositories/identity-upload-draw-repository";

const allowedPlatforms = new Set(["web", "wechat"]);
const allowedMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);
const maxUploadBytes = 8 * 1024 * 1024;

export type DomainFailure = {
  ok: false;
  status: number;
  code: ApiErrorCode | "FILE_TOO_LARGE" | "UNSUPPORTED_FILE_TYPE";
  message: string;
  details?: Record<string, unknown>;
};

type DomainSuccess<T> = {
  ok: true;
  data: T;
};

type DomainResult<T> = DomainSuccess<T> | DomainFailure;

export type UploadedFileInput = {
  name: string;
  type: string;
  size: number;
};

export class IdentityUploadDrawService {
  constructor(private readonly repository: IdentityUploadDrawRepository = createIdentityUploadDrawRepository()) {}

  async createAnonymousIdentity(input: {
    platform?: unknown;
    timezone?: unknown;
    anonymousId?: unknown;
  }): Promise<DomainResult<{ anonymousId: string; created: boolean }>> {
    const validation = validatePlatform(input.platform);
    if (!validation.ok) {
      return validation;
    }

    const anonymousId = optionalString(input.anonymousId) ?? `anon_${randomUUID().replaceAll("-", "")}`;
    const timezone = optionalString(input.timezone);
    const existing = await this.repository.findUserByAnonymousId(anonymousId);
    if (existing) {
      await this.repository.updateAnonymousUser({
        anonymousId,
        platform: validation.platform,
        timezone
      });
      return { ok: true, data: { anonymousId, created: false } };
    }

    const created = await this.repository.createAnonymousUser({
      anonymousId,
      platform: validation.platform,
      timezone
    });
    return { ok: true, data: { anonymousId: created!.anonymousId, created: true } };
  }

  async getTodayCard(input: {
    anonymousId?: string | null;
    timezone?: string | null;
    now?: Date;
  }): Promise<DomainResult<{ hasActiveCard: false } | {
    hasActiveCard: true;
    cardId: string;
    auraName: string | null;
    activatedAt: string | null;
  }>> {
    const anonymousId = optionalString(input.anonymousId);
    if (!anonymousId) {
      return validationError("anonymousId is required.", { field: "anonymousId" });
    }

    const user = await this.repository.findUserByAnonymousId(anonymousId);
    if (!user) {
      return notFound("Anonymous user was not found.", { anonymousId });
    }

    const { start, end } = utcDayWindow(input.now ?? new Date());
    const card = await this.repository.findTodayActiveCard({
      userId: user.id,
      start,
      end
    });
    if (!card) {
      return { ok: true, data: { hasActiveCard: false } };
    }

    const content = asRecord(card.content);
    return {
      ok: true,
      data: {
        hasActiveCard: true,
        cardId: card.id,
        auraName: stringOrNull(content.auraName),
        activatedAt: card.activatedAt?.toISOString() ?? null
      }
    };
  }

  async createOutfitUpload(input: {
    anonymousId?: unknown;
    platform?: unknown;
    file?: UploadedFileInput | null;
  }): Promise<DomainResult<{
    uploadId: string;
    publicUrl: string;
    styleNotes: Record<string, unknown>;
  }>> {
    const auth = await this.validateKnownUser(input.anonymousId, input.platform);
    if (!auth.ok) {
      return auth;
    }

    if (!input.file) {
      return validationError("file is required.", { field: "file" });
    }

    if (input.file.size > maxUploadBytes) {
      return {
        ok: false,
        status: 413,
        code: "FILE_TOO_LARGE",
        message: "Upload must be 8MB or smaller.",
        details: { maxBytes: maxUploadBytes, actualBytes: input.file.size }
      };
    }

    const extension = allowedMimeTypes.get(input.file.type);
    if (!extension) {
      return {
        ok: false,
        status: 415,
        code: "UNSUPPORTED_FILE_TYPE",
        message: "Upload must be jpg, png, or webp.",
        details: { allowedTypes: Array.from(allowedMimeTypes.keys()), actualType: input.file.type }
      };
    }

    const uploadToken = `upload_${randomUUID().replaceAll("-", "")}`;
    const publicUrl = `/uploads/${uploadToken}.${extension}`;
    const record = await this.repository.createOutfitUpload({
      userId: auth.user.id,
      platform: auth.platform,
      fileName: input.file.name || `outfit.${extension}`,
      mimeType: input.file.type,
      fileSize: input.file.size,
      storagePath: `local://uploads/${uploadToken}.${extension}`,
      publicUrl,
      styleNotes: buildStyleNotes(input.file.type)
    });

    return {
      ok: true,
      data: {
        uploadId: record!.id,
        publicUrl: record!.publicUrl!,
        styleNotes: asRecord(record!.styleNotes)
      }
    };
  }

  async startDrawSession(input: {
    anonymousId?: unknown;
    platform?: unknown;
    mood?: unknown;
    context?: unknown;
    uploadId?: unknown;
    now?: Date;
  }): Promise<DomainResult<{
    drawSessionId: string;
    drawSeed: string;
    expiresAt: string;
    cards: Array<{ position: number; label: string }>;
  }>> {
    const auth = await this.validateKnownUser(input.anonymousId, input.platform);
    if (!auth.ok) {
      return auth;
    }

    const mood = optionalString(input.mood);
    if (!mood) {
      return validationError("mood is required.", { field: "mood" });
    }

    const context = optionalString(input.context);
    const uploadId = optionalString(input.uploadId);
    if (uploadId) {
      const upload = await this.repository.findUploadForUser({
        uploadId,
        userId: auth.user.id
      });
      if (!upload) {
        return notFound("Upload was not found for this anonymous user.", { uploadId });
      }
    }

    const now = input.now ?? new Date();
    const drawSeed = createDrawSeed({
      anonymousId: auth.user.anonymousId,
      mood,
      context,
      uploadId,
      day: now.toISOString().slice(0, 10)
    });
    const existing = await this.repository.findDrawSessionBySeed({
      userId: auth.user.id,
      drawSeed
    });
    if (existing) {
      return {
        ok: true,
        data: {
          drawSessionId: existing.id,
          drawSeed: existing.drawSeed,
          expiresAt: existing.expiresAt.toISOString(),
          cards: normalizeCards(existing.cardOptions)
        }
      };
    }

    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
    const cards = defaultDrawCards();
    const created = await this.repository.createDrawSession({
      userId: auth.user.id,
      mood,
      context,
      uploadId,
      drawSeed,
      cardOptions: cards,
      expiresAt
    });

    return {
      ok: true,
      data: {
        drawSessionId: created!.id,
        drawSeed: created!.drawSeed,
        expiresAt: created!.expiresAt.toISOString(),
        cards
      }
    };
  }

  private async validateKnownUser(
    anonymousIdInput: unknown,
    platformInput: unknown
  ): Promise<DomainFailure | { ok: true; user: NonNullable<Awaited<ReturnType<IdentityUploadDrawRepository["findUserByAnonymousId"]>>>; platform: string }> {
    const platform = validatePlatform(platformInput);
    if (!platform.ok) {
      return platform;
    }

    const anonymousId = optionalString(anonymousIdInput);
    if (!anonymousId) {
      return validationError("anonymousId is required.", { field: "anonymousId" });
    }

    const user = await this.repository.findUserByAnonymousId(anonymousId);
    if (!user) {
      return notFound("Anonymous user was not found.", { anonymousId });
    }

    return { ok: true, user, platform: platform.platform };
  }
}

export function createIdentityUploadDrawService(repository?: IdentityUploadDrawRepository) {
  return new IdentityUploadDrawService(repository);
}

function validatePlatform(platformInput: unknown): DomainFailure | { ok: true; platform: string } {
  const platform = optionalString(platformInput);
  if (!platform || !allowedPlatforms.has(platform)) {
    return validationError("platform must be web or wechat.", {
      field: "platform",
      allowed: Array.from(allowedPlatforms),
      actual: platform ?? null
    });
  }
  return { ok: true, platform };
}

function validationError(message: string, details: Record<string, unknown>): DomainFailure {
  return { ok: false, status: 400, code: "VALIDATION_ERROR", message, details };
}

function notFound(message: string, details: Record<string, unknown>): DomainFailure {
  return { ok: false, status: 404, code: "NOT_FOUND", message, details };
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function stringOrNull(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function utcDayWindow(now: Date) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

function buildStyleNotes(mimeType: string) {
  return {
    mood: "soft polished",
    source: "local-metadata-only",
    uploadMimeType: mimeType
  };
}

function createDrawSeed(input: {
  anonymousId: string;
  mood: string;
  context: string | null;
  uploadId: string | null;
  day: string;
}) {
  const digest = createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex")
    .slice(0, 16);
  return `seed_${digest}`;
}

function defaultDrawCards() {
  return [
    { position: 1, label: "Card I" },
    { position: 2, label: "Card II" },
    { position: 3, label: "Card III" }
  ];
}

function normalizeCards(value: unknown) {
  if (!Array.isArray(value)) {
    return defaultDrawCards();
  }
  return value
    .map((card) => asRecord(card))
    .map((card, index) => ({
      position: typeof card.position === "number" ? card.position : index + 1,
      label: typeof card.label === "string" ? card.label : `Card ${index + 1}`
    }))
    .slice(0, 3);
}
