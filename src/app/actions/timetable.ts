"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getTimetable() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;

  if (!userId) return null;

  try {
    const { prisma } = await import("@/lib/db");
    
    let timetable: any = null;
    if ((prisma as any).timetable) {
      timetable = await (prisma as any).timetable.findUnique({
        where: { userId }
      });
    } else {
      // Direct SQL Fallback with table creation if missing
      try {
        const results: any[] = await prisma.$queryRawUnsafe(
          `SELECT * FROM Timetable WHERE userId = ? LIMIT 1`,
          userId
        );
        timetable = results[0];
      } catch (e: any) {
        if (e.message.includes("no such table")) {
          // Manually create the table if Prisma failed to do so
          await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Timetable" (
              "id" TEXT NOT NULL PRIMARY KEY,
              "userId" TEXT NOT NULL,
              "data" TEXT NOT NULL,
              "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" DATETIME NOT NULL,
              CONSTRAINT "Timetable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
            )
          `);
          await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Timetable_userId_key" ON "Timetable"("userId")`);
        }
      }
    }
    
    return timetable ? JSON.parse(timetable.data) : null;
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return null;
  }
}

export async function saveTimetable(data: any) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;

  if (!userId) return { error: "يجب تسجيل الدخول لحفظ الجدول" };

  try {
    const { prisma } = await import("@/lib/db");
    const dataStr = JSON.stringify(data);

    if ((prisma as any).timetable) {
      await (prisma as any).timetable.upsert({
        where: { userId },
        update: { data: dataStr },
        create: { userId, data: dataStr }
      });
    } else {
      // Direct SQL Upsert Fallback
      const now = new Date().toISOString();
      const existing: any[] = await prisma.$queryRawUnsafe(
        `SELECT id FROM Timetable WHERE userId = ?`,
        userId
      );

      if (existing.length > 0) {
        await prisma.$executeRawUnsafe(
          `UPDATE Timetable SET data = ?, updatedAt = ? WHERE userId = ?`,
          dataStr, now, userId
        );
      } else {
        const id = `tt_${Date.now()}`;
        await prisma.$executeRawUnsafe(
          `INSERT INTO Timetable (id, userId, data, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
          id, userId, dataStr, now, now
        );
      }
    }

    revalidatePath("/timetable");
    return { success: true };
  } catch (error) {
    console.error("Error saving timetable:", error);
    return { error: "حدث خطأ أثناء حفظ الجدول" };
  }
}
