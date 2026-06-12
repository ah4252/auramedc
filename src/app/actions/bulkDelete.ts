"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

// ── Favorites ────────────────────────────────────────────────
export async function deleteFavorite(id: string) {
  await requireAdmin();
  try {
    await prisma.favorite.delete({ where: { id } });
    revalidatePath("/admin/favorites");
    return { success: true };
  } catch {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}

export async function bulkDeleteFavorites(ids: string[]) {
  await requireAdmin();
  if (!ids?.length) return { error: "لم يتم تحديد أي عنصر" };
  try {
    await prisma.favorite.deleteMany({ where: { id: { in: ids } } });
    revalidatePath("/admin/favorites");
    return { success: true, count: ids.length };
  } catch {
    return { error: "حدث خطأ أثناء الحذف الجماعي" };
  }
}

// ── Users ─────────────────────────────────────────────────────
export async function bulkDeleteUsers(ids: string[]) {
  await requireAdmin();
  if (!ids?.length) return { error: "لم يتم تحديد أي مستخدم" };
  try {
    // cascade manually
    await prisma.comment.deleteMany({ where: { userId: { in: ids } } });
    await prisma.favorite.deleteMany({ where: { userId: { in: ids } } });
    await prisma.progress.deleteMany({ where: { userId: { in: ids } } });
    if ((prisma as any).gPACalculation) {
      await (prisma as any).gPACalculation.deleteMany({ where: { userId: { in: ids } } });
    }
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    revalidatePath("/admin/users");
    return { success: true, count: ids.length };
  } catch {
    return { error: "حدث خطأ أثناء الحذف الجماعي" };
  }
}

// ── Lessons (Posts) ───────────────────────────────────────────
export async function bulkDeleteLessons(ids: string[]) {
  await requireAdmin();
  if (!ids?.length) return { error: "لم يتم تحديد أي درس" };
  try {
    await prisma.favorite.deleteMany({ where: { lessonId: { in: ids } } });
    await prisma.progress.deleteMany({ where: { lessonId: { in: ids } } });
    await prisma.lesson.deleteMany({ where: { id: { in: ids } } });
    revalidatePath("/admin/posts");
    return { success: true, count: ids.length };
  } catch {
    return { error: "حدث خطأ أثناء الحذف الجماعي" };
  }
}
