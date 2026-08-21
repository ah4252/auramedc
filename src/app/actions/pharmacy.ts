"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin, canAccessPharmacy } from "@/lib/auth-helpers";
import { sendBroadcastNotification } from "@/lib/push";
import { broadcast } from "@/lib/sse-store";

function isDatabaseUnavailableError(error: any): boolean {
  const message = error?.message || "";
  return (
    error?.code === "ECONNREFUSED" ||
    error?.code === "ENOTFOUND" ||
    error?.code === "ETIMEDOUT" ||
    /can't reach database server|database server.*running|connection.*refused|timeout.*database/i.test(message)
  );
}

export async function getPharmacyAccess() {
  try {
    return await canAccessPharmacy();
  } catch {
    return false;
  }
}

// Helper to get or create Pharmacy category
async function getOrCreatePharmacyCategory() {
  try {
    return await prisma.category.upsert({
      where: { slug: "pharmacy" },
      update: {
        type: "PHARMACY"
      },
      create: {
        name: "الصيدلة",
        slug: "pharmacy",
        type: "PHARMACY",
        description: "قسم الصيدلة والأدوية والمستندات الطبية"
      }
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      console.warn("Database unavailable while loading pharmacy category:", (error as any)?.message || error);
      return null;
    }
    throw error;
  }
}

// --- Pharmacy Sections (Subjects) ---

export async function getPharmacySections() {
  try {
    const cat = await getOrCreatePharmacyCategory();
    if (!cat) return [];

    const subjects = await prisma.subject.findMany({
      where: { categoryId: cat.id },
      include: {
        lessons: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return subjects.map(sub => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      imageUrl: sub.lessons[0]?.thumbnail || null, // cover image
      order: 0,
      images: sub.lessons.map(l => ({
        id: l.id,
        title: l.title,
        url: l.pdfUrl || l.thumbnail || "",
        description: l.description,
        indications: l.indications,
        sideEffects: l.sideEffects,
        ageLimit: l.ageLimit,
        order: 0
      }))
    }));
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
    const cat = await getOrCreatePharmacyCategory();
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-");
    const slug = `${baseSlug}-${Date.now()}`;

    const subject = await prisma.subject.create({
      data: {
        name,
        description: description || null,
        slug,
        categoryId: cat.id
      },
    });

    // If section cover imageUrl was provided during creation, create cover image lesson
    if (imageUrl && imageUrl.trim()) {
      const coverSlug = `cover-${subject.id.substring(0, 8)}-${Date.now()}`;
      const lesson = await prisma.lesson.create({
        data: {
          title: `غلاف قسم - ${name}`,
          description: "صورة غلاف القسم الصيدلاني",
          slug: coverSlug,
          thumbnail: imageUrl,
          pdfUrl: imageUrl,
          videoUrl: "",
          isPublished: true,
          subjectId: subject.id
        }
      });
      await prisma.resource.create({
        data: {
          id: `res-${lesson.id}`,
          title: "صورة الغلاف",
          type: "IMAGE",
          url: imageUrl,
          lessonId: lesson.id
        }
      });
    }

    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    revalidatePath("/courses");
    
    // SSE
    broadcast("notification", { title: "قسم صيدلاني جديد 💊", body: `تم إضافة قسم جديد: ${name}`, url: "/pharmacy" });
    // Web Push
    await sendBroadcastNotification("قسم صيدلاني جديد 💊", `تم إضافة قسم جديد: ${name}`, "/pharmacy");

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
    await prisma.subject.update({
      where: { id },
      data: { 
        name, 
        description: description || null 
      },
    });

    // Update cover image if provided
    if (imageUrl && imageUrl.trim()) {
      const firstLesson = await prisma.lesson.findFirst({
        where: { subjectId: id },
        orderBy: { createdAt: "asc" }
      });

      if (firstLesson) {
        await prisma.lesson.update({
          where: { id: firstLesson.id },
          data: { thumbnail: imageUrl, pdfUrl: imageUrl }
        });
      } else {
        const coverSlug = `cover-${id.substring(0, 8)}-${Date.now()}`;
        const lesson = await prisma.lesson.create({
          data: {
            title: `غلاف قسم - ${name}`,
            description: "صورة غلاف القسم الصيدلاني",
            slug: coverSlug,
            thumbnail: imageUrl,
            pdfUrl: imageUrl,
            videoUrl: "",
            isPublished: true,
            subjectId: id
          }
        });
        await prisma.resource.create({
          data: {
            id: `res-${lesson.id}`,
            title: "صورة الغلاف",
            type: "IMAGE",
            url: imageUrl,
            lessonId: lesson.id
          }
        });
      }
    }

    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء التعديل" };
  }
}

export async function deletePharmacySection(id: string) {
  await requireAdmin();
  try {
    // Delete all lessons first (due to DB cascade policies or Prisma relation constraints)
    const lessons = await prisma.lesson.findMany({ where: { subjectId: id } });
    const lessonIds = lessons.map(l => l.id);

    if (lessonIds.length > 0) {
      await prisma.comment.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await prisma.favorite.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await prisma.progress.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await prisma.resource.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } });
    }

    await prisma.subject.delete({ where: { id } });
    
    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Delete Pharmacy Section Error:", error);
    return { error: "حدث خطأ أثناء الحذف" };
  }
}

export async function bulkDeletePharmacySections(ids: string[]) {
  await requireAdmin();
  try {
    // Delete lessons for all matching sections
    const lessons = await prisma.lesson.findMany({ where: { subjectId: { in: ids } } });
    const lessonIds = lessons.map(l => l.id);

    if (lessonIds.length > 0) {
      await prisma.comment.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await prisma.favorite.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await prisma.progress.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await prisma.resource.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } });
    }

    await prisma.subject.deleteMany({
      where: { id: { in: ids } },
    });
    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Bulk delete sections error:", error);
    return { error: "حدث خطأ أثناء الحذف الجماعي للأقسام" };
  }
}

// --- Pharmacy Images (Lessons) ---

export async function addPharmacyImage(formData: FormData) {
  await requireAdmin();
  const sectionId = formData.get("sectionId") as string;
  const url = formData.get("url") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const indications = formData.get("indications") as string;
  const sideEffects = formData.get("sideEffects") as string;
  const ageLimit = formData.get("ageLimit") as string;

  if (!sectionId || !url) return { error: "القسم والرابط مطلوبان" };

  try {
    const baseSlug = (title || "file").toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-");
    const slug = `${baseSlug}-${Date.now()}`;

    const lesson = await prisma.lesson.create({
      data: {
        title: title || "ملف / صورة",
        description: description || null,
        indications: indications || null,
        sideEffects: sideEffects || null,
        ageLimit: ageLimit || null,
        slug,
        thumbnail: url,
        pdfUrl: url,
        videoUrl: "",
        isPublished: true,
        subjectId: sectionId
      },
    });

    // Also add to Resource
    await prisma.resource.create({
      data: {
        id: `res-${lesson.id}`,
        title: title || "ملف",
        type: "IMAGE",
        url: url,
        lessonId: lesson.id
      }
    });

    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    revalidatePath("/courses");

    // SSE
    broadcast("notification", { title: "دواء جديد 💊", body: `تمت إضافة دواء/ملف جديد: ${title || 'صورة جديدة'}`, url: "/pharmacy" });
    // Web Push
    await sendBroadcastNotification("دواء جديد 💊", `تمت إضافة دواء/ملف جديد: ${title || 'صورة جديدة'}`, "/pharmacy");

    return { success: true };
  } catch (error) {
    console.error("Add Pharmacy Image Error:", error);
    return { error: "حدث خطأ أثناء إضافة الصورة" };
  }
}

export async function deletePharmacyImage(id: string) {
  await requireAdmin();
  try {
    await prisma.comment.deleteMany({ where: { lessonId: id } });
    await prisma.favorite.deleteMany({ where: { lessonId: id } });
    await prisma.progress.deleteMany({ where: { lessonId: id } });
    await prisma.resource.deleteMany({ where: { lessonId: id } });
    await prisma.lesson.delete({ where: { id } });

    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء حذف الصورة" };
  }
}

export async function bulkDeletePharmacyImages(ids: string[]) {
  await requireAdmin();
  try {
    await prisma.comment.deleteMany({ where: { lessonId: { in: ids } } });
    await prisma.favorite.deleteMany({ where: { lessonId: { in: ids } } });
    await prisma.progress.deleteMany({ where: { lessonId: { in: ids } } });
    await prisma.resource.deleteMany({ where: { lessonId: { in: ids } } });
    await prisma.lesson.deleteMany({
      where: { id: { in: ids } },
    });
    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    revalidatePath("/courses");
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
  const indications = formData.get("indications") as string;
  const sideEffects = formData.get("sideEffects") as string;
  const ageLimit = formData.get("ageLimit") as string;

  if (!url) return { error: "رابط الصورة مطلوب" };

  try {
    await prisma.lesson.update({
      where: { id },
      data: { 
        thumbnail: url,
        pdfUrl: url,
        title: title || "ملف / صورة", 
        description: description || null,
        indications: indications || null,
        sideEffects: sideEffects || null,
        ageLimit: ageLimit || null
      },
    });

    // Update resource too
    await prisma.resource.upsert({
      where: { id: `res-${id}` },
      update: {
        title: title || "ملف",
        url: url
      },
      create: {
        id: `res-${id}`,
        title: title || "ملف",
        type: "IMAGE",
        url: url,
        lessonId: id
      }
    });

    revalidatePath("/admin/pharmacy");
    revalidatePath("/pharmacy");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Update pharmacy image error:", error);
    return { error: "حدث خطأ أثناء التعديل" };
  }
}
