"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(lessonId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  if (!userId) return { error: "يجب تسجيل الدخول أولاً" };

  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });
      revalidatePath(`/courses`);
      return { success: true, favorited: false };
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          lessonId
        }
      });
      revalidatePath(`/courses`);
      return { success: true, favorited: true };
    }
  } catch (err) {
    return { error: "حدث خطأ أثناء تحديث المفضلة" };
  }
}
