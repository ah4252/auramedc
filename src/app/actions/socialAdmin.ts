"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

export async function getSocialUsers() {
  try {
    const users: any[] = await prisma.$queryRaw`
      SELECT id, name, email, image, telegram, instagram, facebook, "createdAt" 
      FROM "User" 
      WHERE telegram IS NOT NULL 
         OR instagram IS NOT NULL 
         OR facebook IS NOT NULL
      ORDER BY "createdAt" DESC
    `;
    return users.filter(u => 
      (u.telegram && u.telegram.trim() !== "") || 
      (u.instagram && u.instagram.trim() !== "") || 
      (u.facebook && u.facebook.trim() !== "")
    );
  } catch (error) {
    console.error("Error fetching social users:", error);
    return [];
  }
}

export async function clearSocialLinks(userId: string) {
  await requireAdmin();
  try {
    await prisma.$executeRaw`
      UPDATE "User" SET telegram = NULL, instagram = NULL, facebook = NULL WHERE id = ${userId}
    `;
    revalidatePath("/admin/social");
    return { success: true };
  } catch {
    return { error: "حدث خطأ أثناء مسح الروابط" };
  }
}

export async function bulkClearSocialLinks(ids: string[]) {
  await requireAdmin();
  if (!ids?.length) return { error: "لم يتم تحديد أي مستخدم" };
  try {
    for (const id of ids) {
      await prisma.$executeRaw`
        UPDATE "User" SET telegram = NULL, instagram = NULL, facebook = NULL WHERE id = ${id}
      `;
    }
    revalidatePath("/admin/social");
    return { success: true, count: ids.length };
  } catch {
    return { error: "حدث خطأ أثناء الحذف الجماعي" };
  }
}
