import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export async function prepareSqliteTestDatabase(prisma) {
  await prisma.$executeRawUnsafe("PRAGMA journal_mode = MEMORY");
  const tables = await prisma.$queryRawUnsafe("select name from sqlite_master where type = 'table' and name = 'AnonymousUser'");
  if (Array.isArray(tables) && tables.length > 0) {
    return;
  }

  const migrationPath = resolve(process.cwd(), "prisma/migrations/20260604010930_init/migration.sql");
  const statements = readFileSync(migrationPath, "utf8")
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }
}
