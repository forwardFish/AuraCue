import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "./prisma-client";

export type GenerationRepository = {
  client: PrismaClient;
  findUserByAnonymousId(anonymousId: string): Promise<AnonymousUserRecord | null>;
  findDrawSessionForUser(input: { drawSessionId: string; userId: string }): Promise<DrawSessionWithUploadRecord | null>;
  findJobByDrawSelection(input: { drawSessionId: string; drawPosition: number }): Promise<GenerationJobWithCardRecord | null>;
  findJobById(jobId: string): Promise<GenerationJobWithCardRecord | null>;
  createSuccessfulGeneration(input: {
    userId: string;
    drawSessionId: string;
    drawPosition: number;
    provider: string;
    fallbackUsed: boolean;
    uploadId: string | null;
    mood: string;
    context: string | null;
    drawSeed: string;
    content: Prisma.InputJsonValue;
  }): Promise<GenerationJobWithCardRecord>;
};

export type AnonymousUserRecord = Awaited<ReturnType<PrismaClient["anonymousUser"]["findUnique"]>>;
export type DrawSessionWithUploadRecord = Prisma.DrawSessionGetPayload<{ include: { upload: true } }>;
export type GenerationJobWithCardRecord = Prisma.GenerationJobGetPayload<{ include: { card: true } }>;

export function createGenerationRepository(client: PrismaClient = prisma): GenerationRepository {
  return {
    client,
    findUserByAnonymousId(anonymousId) {
      return client.anonymousUser.findUnique({ where: { anonymousId } });
    },
    findDrawSessionForUser(input) {
      return client.drawSession.findFirst({
        where: {
          id: input.drawSessionId,
          userId: input.userId
        },
        include: {
          upload: true
        }
      });
    },
    findJobByDrawSelection(input) {
      return client.generationJob.findUnique({
        where: {
          drawSessionId_drawPosition: {
            drawSessionId: input.drawSessionId,
            drawPosition: input.drawPosition
          }
        },
        include: {
          card: true
        }
      });
    },
    findJobById(jobId) {
      return client.generationJob.findUnique({
        where: { id: jobId },
        include: {
          card: true
        }
      });
    },
    createSuccessfulGeneration(input) {
      return client.$transaction(async (tx) => {
        const job = await tx.generationJob.create({
          data: {
            userId: input.userId,
            drawSessionId: input.drawSessionId,
            drawPosition: input.drawPosition,
            status: "success",
            provider: input.provider,
            fallbackUsed: input.fallbackUsed,
            completedAt: new Date()
          }
        });

        const card = await tx.auraCard.create({
          data: {
            userId: input.userId,
            generationJobId: job.id,
            uploadId: input.uploadId,
            mood: input.mood,
            context: input.context,
            drawSeed: input.drawSeed,
            drawPosition: input.drawPosition,
            content: input.content,
            isActivated: false
          }
        });

        return tx.generationJob.update({
          where: { id: job.id },
          data: { resultCardId: card.id },
          include: { card: true }
        });
      });
    }
  };
}
