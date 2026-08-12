import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig, Pool } from "@neondatabase/serverless";

// Required for Vercel serverless (uses WebSocket instead of TCP)
if (typeof WebSocket === "undefined") {
  // Node.js environment (local dev) — use ws
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  neonConfig.webSocketConstructor = require("ws");
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.includes("localhost:5432/postgres")) {
    // Fallback client for environments without a real DB
    return new PrismaClient({ log: ["error"] });
  }

  try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);

    return new PrismaClient({
      adapter,
      log: ["error"],
    });
  } catch (e) {
    console.warn("[DB] Neon adapter initialization failed, using standard PrismaClient:", e);
    return new PrismaClient({ log: ["error"] });
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function isDatabaseEnabled() {
  const databaseUrl = (process.env.DATABASE_URL || "").trim();
  if (!databaseUrl) return false;
  return true;
}
