"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";

// --- Pharmacy Sections ---

export async function getPharmacySections() {
  try {
    return await (prisma as any).pharmacySection.findMany({
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Get Pharmacy Sections Error:", error);
    return [];
  }
}

export async function addPharmacySection(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!name) return { error: "اسم القسم مطلوب" };

  try {
    const count = await (prisma as any).pharmacySection.count();
    await (prisma as any).pharmacySection.create({
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        order: count,
      },
    });
    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    return { success: true };
  } catch (error) {
    console.error("Add Pharmacy Section Error:", error);
    return { error: "حدث خطأ أثناء إضافة القسم" };
  }
}

export async function updatePharmacySection(id: string, formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!name) return { error: "اسم القسم مطلوب" };

  try {
    await (prisma as any).pharmacySection.update({
      where: { id },
      data: { name, description: description || null, imageUrl: imageUrl || null },
    });
    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء التعديل" };
  }
}

export async function deletePharmacySection(id: string) {
  await requireAdmin();
  try {
    await (prisma as any).pharmacySection.delete({ where: { id } });
    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}

export async function bulkDeletePharmacySections(ids: string[]) {
  await requireAdmin();
  try {
    await (prisma as any).pharmacySection.deleteMany({
      where: { id: { in: ids } },
    });
    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    return { success: true };
  } catch (error) {
    console.error("Bulk delete sections error:", error);
    return { error: "حدث خطأ أثناء الحذف الجماعي للأقسام" };
  }
}

// --- Pharmacy Images ---

export async function addPharmacyImage(formData: FormData) {
  await requireAdmin();
  const sectionId = formData.get("sectionId") as string;
  const url = formData.get("url") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!sectionId || !url) return { error: "القسم والرابط مطلوبان" };

  try {
    const count = await (prisma as any).pharmacyImage.count({ where: { sectionId } });
    await (prisma as any).pharmacyImage.create({
      data: {
        sectionId,
        url,
        title: title || null,
        description: description || null,
        order: count,
      },
    });
    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    return { success: true };
  } catch (error) {
    console.error("Add Pharmacy Image Error:", error);
    return { error: "حدث خطأ أثناء إضافة الصورة" };
  }
}

export async function deletePharmacyImage(id: string) {
  await requireAdmin();
  try {
    await (prisma as any).pharmacyImage.delete({ where: { id } });
    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء حذف الصورة" };
  }
}

export async function bulkDeletePharmacyImages(ids: string[]) {
  await requireAdmin();
  try {
    await (prisma as any).pharmacyImage.deleteMany({
      where: { id: { in: ids } },
    });
    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    return { success: true };
  } catch (error) {
    console.error("Bulk delete error:", error);
    return { error: "حدث خطأ أثناء الحذف الجماعي" };
  }
}

export async function updatePharmacyImage(id: string, formData: FormData) {
  await requireAdmin();
  const url = formData.get("url") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!url) return { error: "رابط الصورة مطلوب" };

  try {
    await (prisma as any).pharmacyImage.update({
      where: { id },
      data: { url, title: title || null, description: description || null },
    });
    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء التعديل" };
  }
}
