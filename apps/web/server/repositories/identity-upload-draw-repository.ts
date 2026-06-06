import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "./prisma-client";

export type IdentityUploadDrawRepository = {
  client: PrismaClient;
  findUserByAnonymousId(anonymousId: string): Promise<AnonymousUserRecord | null>;
  createAnonymousUser(input: { anonymousId: string; platform: string; timezone?: string | null }): Promise<AnonymousUserRecord>;
  updateAnonymousUser(input: { anonymousId: string; platform: string; timezone?: string | null }): Promise<AnonymousUserRecord>;
  findTodayActiveCard(input: { userId: string; start: Date; end: Date }): Promise<TodayActiveCardRecord | null>;
  createOutfitUpload(input: Prisma.OutfitUploadUncheckedCreateInput): Promise<OutfitUploadRecord>;
  findUploadForUser(input: { uploadId: string; userId: string }): Promise<OutfitUploadRecord | null>;
  findDrawSessionBySeed(input: { userId: string; drawSeed: string }): Promise<DrawSessionRecord | null>;
  createDrawSession(input: Prisma.DrawSessionUncheckedCreateInput): Promise<DrawSessionRecord>;
};

export type AnonymousUserRecord = Awaited<ReturnType<PrismaClient["anonymousUser"]["findUnique"]>>;
export type OutfitUploadRecord = Awaited<ReturnType<PrismaClient["outfitUpload"]["findUnique"]>>;
export type DrawSessionRecord = Awaited<ReturnType<PrismaClient["drawSession"]["findUnique"]>>;

export type TodayActiveCardRecord = {
  id: string;
  content: Prisma.JsonValue;
  activatedAt: Date | null;
};

export function createIdentityUploadDrawRepository(
  client: PrismaClient = prisma
): IdentityUploadDrawRepository {
  return {
    client,
    findUserByAnonymousId(anonymousId) {
      return client.anonymousUser.findUnique({ where: { anonymousId } });
    },
    createAnonymousUser(input) {
      return client.anonymousUser.create({
        data: {
          anonymousId: input.anonymousId,
          platform: input.platform,
          timezone: input.timezone ?? null
        }
      });
    },
    updateAnonymousUser(input) {
      return client.anonymousUser.update({
        where: { anonymousId: input.anonymousId },
        data: {
          platform: input.platform,
          timezone: input.timezone ?? null
        }
      });
    },
    findTodayActiveCard(input) {
      return client.auraCard.findFirst({
        where: {
          userId: input.userId,
          isActivated: true,
          activatedAt: {
            gte: input.start,
            lt: input.end
          }
        },
        orderBy: { activatedAt: "desc" },
        select: {
          id: true,
          content: true,
          activatedAt: true
        }
      });
    },
    createOutfitUpload(input) {
      return client.outfitUpload.create({ data: input });
    },
    findUploadForUser(input) {
      return client.outfitUpload.findFirst({
        where: {
          id: input.uploadId,
          userId: input.userId
        }
      });
    },
    findDrawSessionBySeed(input) {
      return client.drawSession.findUnique({
        where: {
          userId_drawSeed: {
            userId: input.userId,
            drawSeed: input.drawSeed
          }
        }
      });
    },
    createDrawSession(input) {
      return client.drawSession.upsert({
        where: {
          userId_drawSeed: {
            userId: input.userId,
            drawSeed: input.drawSeed
          }
        },
        create: input,
        update: {}
      });
    }
  };
}
