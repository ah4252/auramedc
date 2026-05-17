import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// تفعيل دعم الـ WebSocket لـ Neon في بيئات Node.js لثبات الاتصال
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("❌ DATABASE_URL environment variable is missing!");
      }
      console.warn("⚠️ DATABASE_URL is not set. Using default PrismaClient.");
      return new PrismaClient({ log: ["error"] });
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    return new PrismaClient({
      adapter,
      log: ["error"],
    });
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
