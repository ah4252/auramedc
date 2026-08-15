"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

function isMissingTableError(error: any) {
  return error?.code === "P2021" || /does not exist in the current database|table .* does not exist/i.test(error?.message || "");
}

function isDatabaseUnavailableError(error: any) {
  return error?.code === "P1001" || /Can't reach database server|connection.*refused|ECONNREFUSED|database server.*running|timeout/i.test(error?.message || "");
}

function isQcmsClientReady() {
  return Boolean((prisma as any).qcmsYear && (prisma as any).qcmsSubject);
}

export async function getQcmsYears() {
  try {
    if (!(prisma as any).qcmsYear) {
      console.warn("QCMS Prisma model qcmsYear is not available in generated client");
      return [];
    }

    const includeSubjects: any = {
      orderBy: { createdAt: "asc" }
    };

    if ((prisma as any).qcmsExamLink) {
      includeSubjects.include = {
        examLinks: {
          orderBy: { createdAt: "asc" }
        }
      };
    }

    return await (prisma as any).qcmsYear.findMany({
      include: {
        subjects: includeSubjects
      },
      orderBy: { createdAt: "asc" }
    });
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error)) {
      console.warn("QCMS database is unavailable or table is missing:", (error as any)?.message || error);
      return [];
    }

    console.error("Error fetching QCMS years:", error);
    return [];
  }
}

export async function createQcmsYear(name: string, slug: string) {
  await requireAdmin();

  if (!(prisma as any).qcmsYear) {
    return { error: "نموذج Prisma QCMS غير مُولَّد في العميل الحالي" };
  }

  try {
    await (prisma as any).qcmsYear.create({
      data: { name, slug }
    });
    revalidatePath("/admin/qcms");
    revalidatePath("/qcms");
    return { success: true };
  } catch (error) {
    if (isMissingTableError(error)) {
      return { error: "جدول QCMS غير موجود في قاعدة البيانات، قم بترحيل schema أولاً" };
    }

    console.error("Error creating QCMS year:", error);
    return { error: "فشل في إنشاء السنة الدراسية" };
  }
}

export async function deleteQcmsYear(id: string) {
  await requireAdmin();

  if (!(prisma as any).qcmsYear) {
    return { error: "نموذج Prisma QCMS غير مُولَّد في العميل الحالي" };
  }

  try {
    await (prisma as any).qcmsYear.delete({
      where: { id }
    });
    revalidatePath("/admin/qcms");
    revalidatePath("/qcms");
    return { success: true };
  } catch (error) {
    if (isMissingTableError(error)) {
      return { error: "جدول QCMS غير موجود في قاعدة البيانات" };
    }

    console.error("Error deleting QCMS year:", error);
    return { error: "فشل في حذف السنة الدراسية" };
  }
}

export async function createQcmsSubject(qcmsYearId: string, name: string, code?: string, order?: number) {
  await requireAdmin();

  if (!(prisma as any).qcmsSubject) {
    return { error: "نموذج Prisma QCMS غير مُولَّد في العميل الحالي" };
  }

  try {
    await (prisma as any).qcmsSubject.create({
      data: {
        qcmsYearId,
        name,
        code: code || null,
        order: order || 0
      }
    });
    revalidatePath("/admin/qcms");
    revalidatePath("/qcms");
    return { success: true };
  } catch (error) {
    if (isMissingTableError(error)) {
      return { error: "جدول QCMS غير موجود في قاعدة البيانات" };
    }

    console.error("Error creating QCMS subject:", error);
    return { error: "فشل في إضافة المادة الدراسية" };
  }
}

export async function deleteQcmsSubject(id: string) {
  await requireAdmin();

  if (!(prisma as any).qcmsSubject) {
    return { error: "نموذج Prisma QCMS غير مُولَّد في العميل الحالي" };
  }

  try {
    await (prisma as any).qcmsSubject.delete({
      where: { id }
    });
    revalidatePath("/admin/qcms");
    revalidatePath("/qcms");
    return { success: true };
  } catch (error) {
    if (isMissingTableError(error)) {
      return { error: "جدول QCMS غير موجود في قاعدة البيانات" };
    }

    console.error("Error deleting QCMS subject:", error);
    return { error: "فشل في حذف المادة الدراسية" };
  }
}

export async function createQcmsExamLink(qcmsSubjectId: string, label: string, url: string, isFeatured: boolean) {
  await requireAdmin();

  if (!(prisma as any).qcmsExamLink) {
    return { error: "نموذج Prisma رابط امتحان QCMS غير مُولَّد في العميل الحالي" };
  }

  try {
    await (prisma as any).qcmsExamLink.create({
      data: {
        qcmsSubjectId,
        label: label.trim(),
        url: url.trim(),
        isFeatured
      }
    });
    revalidatePath("/admin/qcms");
    revalidatePath("/qcms");
    return { success: true };
  } catch (error) {
    if (isMissingTableError(error)) {
      return { error: "جدول روابط QCMS غير موجود في قاعدة البيانات" };
    }

    console.error("Error creating QCMS exam link:", error);
    return { error: "فشل في إضافة رابط الاختبار" };
  }
}

export async function deleteQcmsExamLink(id: string) {
  await requireAdmin();

  if (!(prisma as any).qcmsExamLink) {
    return { error: "نموذج Prisma رابط امتحان QCMS غير مُولَّد في العميل الحالي" };
  }

  try {
    await (prisma as any).qcmsExamLink.delete({
      where: { id }
    });
    revalidatePath("/admin/qcms");
    revalidatePath("/qcms");
    return { success: true };
  } catch (error) {
    if (isMissingTableError(error)) {
      return { error: "جدول روابط QCMS غير موجود في قاعدة البيانات" };
    }

    console.error("Error deleting QCMS exam link:", error);
    return { error: "فشل في حذف رابط الاختبار" };
  }
}

export async function updateQcmsExamLink(id: string, label: string, url: string) {
  await requireAdmin();

  if (!(prisma as any).qcmsExamLink) {
    return { error: "نموذج Prisma رابط امتحان QCMS غير مُولَّد في العميل الحالي" };
  }

  const safeLabel = label.trim();
  const safeUrl = url.trim();

  if (!safeLabel || !safeUrl) {
    return { error: "اسم الرابط ورابطه مطلوبان" };
  }

  try {
    await (prisma as any).qcmsExamLink.update({
      where: { id },
      data: { label: safeLabel, url: safeUrl }
    });
    revalidatePath("/admin/qcms");
    revalidatePath("/courses");
    revalidatePath("/qcms");
    return { success: true };
  } catch (error) {
    if (isMissingTableError(error)) {
      return { error: "جدول روابط QCMS غير موجود في قاعدة البيانات" };
    }

    console.error("Error updating QCMS exam link:", error);
    return { error: "فشل في تحديث اسم الرابط أو عنوانه" };
  }
}

export async function updateQcmsExamLinkFeatured(id: string, isFeatured: boolean) {
  await requireAdmin();

  if (!(prisma as any).qcmsExamLink) {
    return { error: "نموذج Prisma رابط امتحان QCMS غير مُولَّد في العميل الحالي" };
  }

  try {
    await (prisma as any).qcmsExamLink.update({
      where: { id },
      data: { isFeatured }
    });
    revalidatePath("/admin/qcms");
    revalidatePath("/courses");
    revalidatePath("/qcms");
    return { success: true };
  } catch (error) {
    if (isMissingTableError(error)) {
      return { error: "جدول روابط QCMS غير موجود في قاعدة البيانات" };
    }
    console.error("Error updating QCMS exam link featured status:", error);
    return { error: "فشل في تحديث حالة الرابط" };
  }
}

export async function getDevFeaturedYears() {
  try {
    if (!(prisma as any).qcmsYear) return [];

    const years = await (prisma as any).qcmsYear.findMany({
      include: {
        subjects: {
          orderBy: { createdAt: "asc" },
          include: {
            examLinks: {
              where: { isFeatured: true },
              orderBy: { createdAt: "asc" }
            }
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return years;
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error)) {
      console.warn("Dev featured QCMS years unavailable:", (error as any)?.message || error);
      return [];
    }

    console.error("Error fetching dev featured years:", error);
    return [];
  }
}
