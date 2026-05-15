"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGPAYears() {
  try {
    return await (prisma as any).gpaYear.findMany({
      include: {
        subjects: true
      },
      orderBy: { createdAt: "asc" }
    });
  } catch (error) {
    console.error("Error fetching GPA years:", error);
    return [];
  }
}

export async function createGPAYear(name: string, slug: string) {
  try {
    await (prisma as any).gpaYear.create({
      data: { name, slug }
    });
    revalidatePath("/admin/gpa-calculator");
    revalidatePath("/gpa-calculator");
    return { success: true };
  } catch (error) {
    console.error("Error creating GPA year:", error);
    return { error: "فشل في إنشاء السنة" };
  }
}

export async function deleteGPAYear(id: string) {
  try {
    await (prisma as any).gpaYear.delete({
      where: { id }
    });
    revalidatePath("/admin/gpa-calculator");
    revalidatePath("/gpa-calculator");
    return { success: true };
  } catch (error) {
    console.error("Error deleting GPA year:", error);
    return { error: "فشل في حذف السنة" };
  }
}

export async function createGPASubject(gpaYearId: string, name: string, coefficient: number) {
  try {
    await (prisma as any).gpaSubject.create({
      data: { gpaYearId, name, coefficient }
    });
    revalidatePath("/admin/gpa-calculator");
    revalidatePath("/gpa-calculator");
    return { success: true };
  } catch (error) {
    console.error("Error creating GPA subject:", error);
    return { error: "فشل في إضافة المادة" };
  }
}

export async function deleteGPASubject(id: string) {
  try {
    await (prisma as any).gpaSubject.delete({
      where: { id }
    });
    revalidatePath("/admin/gpa-calculator");
    revalidatePath("/gpa-calculator");
    return { success: true };
  } catch (error) {
    console.error("Error deleting GPA subject:", error);
    return { error: "فشل في حذف المادة" };
  }
}
