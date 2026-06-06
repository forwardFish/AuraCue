import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

export function createPrismaSqliteAdapter() {
  return new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./t03-local.sqlite"
  });
}
