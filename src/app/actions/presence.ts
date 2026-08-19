"use server";

import { cookies } from "next/headers";
import { getUserIdFromCookies } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

// دالة لتنظيف الحسابات الخاملة (أكثر من شهر)
async function cleanupInactiveUsers() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const inactiveUsers = await prisma.user.findMany({
      where: {
        lastActiveAt: { lt: thirtyDaysAgo },
        role: "USER" // لا نحذف حسابات المديرين
      },
      select: { id: true }
    });

    for (const user of inactiveUsers) {
      const userId = user.id;
      await prisma.$transaction([
        prisma.comment.deleteMany({ where: { userId } }),
        prisma.favorite.deleteMany({ where: { userId } }),
        prisma.progress.deleteMany({ where: { userId } }),
        prisma.gPACalculation.deleteMany({ where: { userId } }),
        prisma.newsComment.deleteMany({ where: { userId } }),
        prisma.friendship.deleteMany({ where: { OR: [{ userId }, { friendId: userId }] } }),
        prisma.user.delete({ where: { id: userId } })
      ]);
    }
  } catch (err) {
    console.error("Cleanup inactive users error:", err);
  }
}

export async function pingPresence() {
  const cookieStore = await cookies();
  const userId = getUserIdFromCookies(cookieStore);
  if (!userId) return { success: false };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    });

    // 1% chance to trigger background cleanup
    if (Math.random() < 0.01) {
      cleanupInactiveUsers(); 
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
