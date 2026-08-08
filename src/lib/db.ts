if (!process.env.DATABASE_URL) {
  // Fallback for local development / environments without a real DB
  // This URL satisfies Prisma's validation (protocol must be postgresql://)
  // Adjust the credentials if you have a local Postgres instance.
  process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/postgres";
}
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export function isDatabaseEnabled() {
  const databaseUrl = (process.env.DATABASE_URL || "").trim();
  if (!databaseUrl) return false;
  return true;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
