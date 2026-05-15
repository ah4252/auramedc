import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Enable WebSocket support for Neon in Node.js environments
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    if (!connectionString) {
      console.warn("⚠️ DATABASE_URL is missing. PrismaClient will fail if called.");
      return new PrismaClient();
    }
    
    // On Vercel, use the standard high-performance driver
    if (process.env.VERCEL === "1") {
      return new PrismaClient({
        log: ["error"],
      });
    }

    // Locally, use the Neon adapter to bypass port 5432 restrictions
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    return new PrismaClient({
      adapter,
      log: ["error"],
    });
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
