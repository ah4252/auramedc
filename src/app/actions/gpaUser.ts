"use server";

import { cookies } from "next/headers";
import { getUserIdFromCookies } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export async function deleteGPACalculation(id: string) {
  const cookieStore = await cookies();
  const userId = getUserIdFromCookies(cookieStore);
  if (!userId) return { error: "يجب تسجيل الدخول أولاً" };

  try {
    const record = await (prisma as any).gPACalculation.findUnique({ where: { id } });
    if (!record || record.userId !== userId) return { error: "غير مصرح بحذف هذا السجل" };

    await (prisma as any).gPACalculation.delete({ where: { id } });
    return { success: true };
  } catch (err: any) {
    console.error("Delete GPA Error:", err);
    return { error: "حدث خطأ أثناء الحذف" };
  }
}

export async function deleteAllGPACalculations() {
  const cookieStore = await cookies();
  const userId = getUserIdFromCookies(cookieStore);
  if (!userId) return { error: "يجب تسجيل الدخول أولاً" };

  try {
    await (prisma as any).gPACalculation.deleteMany({ where: { userId } });
    return { success: true };
  } catch (err: any) {
    console.error("Delete All GPA Error:", err);
    return { error: "حدث خطأ أثناء حذف السجلات" };
  }
}
