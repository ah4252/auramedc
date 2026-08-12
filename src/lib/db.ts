import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  return new PrismaClient({
    log: ["error"],
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function isDatabaseEnabled() {
  const databaseUrl = (process.env.DATABASE_URL || "").trim();
  if (!databaseUrl) return false;
  return true;
}
