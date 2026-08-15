import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function buildDatabaseUrl() {
  const databaseUrl = (process.env.DATABASE_URL || "").trim();
  if (!databaseUrl) return databaseUrl;

  if (databaseUrl.includes("connection_limit=") || databaseUrl.includes("pool_timeout=")) {
    return databaseUrl;
  }

  const separator = databaseUrl.includes("?") ? "&" : "?";
  return `${databaseUrl}${separator}connection_limit=10&pool_timeout=20`;
}

function createPrismaClient() {
  const databaseUrl = buildDatabaseUrl();

  const prismaClient = new PrismaClient({
    log: ["error"],
    ...(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : {}),
  });

  if (typeof process !== "undefined") {
    process.on("beforeExit", () => {
      prismaClient.$disconnect().catch(() => undefined);
    });
  }

  return prismaClient;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function isDatabaseEnabled() {
  const databaseUrl = (process.env.DATABASE_URL || "").trim();
  return Boolean(databaseUrl);
}
