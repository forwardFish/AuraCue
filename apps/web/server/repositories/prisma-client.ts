import { PrismaClient } from "@prisma/client";
import { createPrismaSqliteAdapter } from "./prisma-sqlite-adapter";

const globalForPrisma = globalThis as unknown as {
  auracuePrisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.auracuePrisma ??
  new PrismaClient({
    adapter: createPrismaSqliteAdapter(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.auracuePrisma = prisma;
}
