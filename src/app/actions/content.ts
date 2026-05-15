"use server";

import { prisma } from "../../lib/db";
import { revalidatePath } from "next/cache";


// --- Categories (Years/Subjects) ---
export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string || "YEAR";
  const communityPassword = formData.get("communityPassword") as string || null;
  
  if (!name) return { error: "الاسم مطلوب" };
  
  const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

  try {
    await prisma.category.create({
      data: { name, description, slug, type, communityPassword },
    });
    revalidatePath("/admin/subjects");
    revalidatePath("/courses");
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء الإضافة" };
  }
}

export async function getCategories(type?: string) {
  return await prisma.category.findMany({
    where: type ? { type } : {},
    orderBy: { createdAt: "asc" }
  });
}

export async function getSubjectsByCategorySlug(categorySlug: string) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      subjects: {
        include: {
          lessons: {
            select: { id: true }
          }
        },
        orderBy: { createdAt: "asc" }
      }
    }
  });
  return category;
}

export async function getLessonsBySubjectSlug(subjectSlug: string) {
  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
    include: {
      category: true,
      lessons: {
        include: {
          resources: true,
          favorites: true,
          progress: true
        },
        orderBy: { createdAt: "asc" }
      }
    }
  });
  return subject;
}

// --- Subjects ---
export async function getSubjects() {
  return await prisma.subject.findMany({
    include: { category: true, lessons: { select: { id: true } } },
    orderBy: { createdAt: "desc" }
  });
}

export async function addSubject(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const slug = name.toLowerCase().replace(/ /g, "-") + "-" + Math.random().toString(36).substring(7);

  try {
    const subject = await prisma.subject.create({
      data: { name, slug, description, categoryId }
    });
    return { success: true, subject };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteSubject(id: string) {
  try {
    await prisma.subject.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// --- Lessons ---
export async function addLesson(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const subjectId = formData.get("subjectId") as string;

  if (!title || !subjectId) return { error: "العنوان والمادة الدراسية مطلوبان" };

  const slug = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

  try {
    const resourcesData = formData.get("resources") as string;
    const resources = resourcesData ? JSON.parse(resourcesData) : [];

    // Extract first of each type for legacy fields
    const firstVideo = resources.find((r: any) => r.type === "VIDEO")?.url || "";
    const firstPdf = resources.find((r: any) => r.type === "PDF")?.url || "";
    const firstSummary = resources.find((r: any) => r.type === "SUMMARY")?.url || "";

    const newLesson = await prisma.lesson.create({
      data: {
        title,
        description,
        slug,
        videoUrl: firstVideo,
        pdfUrl: firstPdf,
        summaryUrl: firstSummary,
        isPublished: true,
        subjectId: subjectId,
        resources: {
          create: resources.map((r: any) => ({
            title: r.title,
            type: r.type,
            url: r.url
          }))
        }
      },
    });


    revalidatePath("/admin/lessons");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء إضافة الدرس" };
  }
}

export async function getLessons() {
  try {
    return await prisma.lesson.findMany({
      include: { 
        subject: { 
          include: { 
            category: true 
          } 
        },
        resources: true 
      },
      orderBy: { 
        createdAt: "desc" 
      }
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
}

export async function deleteLesson(id: string) {
  try {
    // Delete related records first
    await prisma.comment.deleteMany({ where: { lessonId: id } });
    await prisma.favorite.deleteMany({ where: { lessonId: id } });
    await prisma.progress.deleteMany({ where: { lessonId: id } });
    await prisma.resource.deleteMany({ where: { lessonId: id } });
    
    await prisma.lesson.delete({ where: { id } });
    revalidatePath("/admin/posts");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Delete Lesson Error:", error);
    return { error: "حدث خطأ أثناء الحذف: تأكد من أن السجل لا يحتوي على بيانات مرتبطة" };
  }
}

export async function deleteCategory(id: string) {
  try {
    // 1. Get all subjects in this category
    const subjects = await prisma.subject.findMany({ where: { categoryId: id } });
    const subjectIds = subjects.map(s => s.id);

    // 2. Get all lessons in these subjects
    const lessons = await prisma.lesson.findMany({ where: { subjectId: { in: subjectIds } } });
    const lessonIds = lessons.map(l => l.id);

    // 3. Delete everything related to these lessons
    await prisma.comment.deleteMany({ where: { lessonId: { in: lessonIds } } });
    await prisma.favorite.deleteMany({ where: { lessonId: { in: lessonIds } } });
    await prisma.progress.deleteMany({ where: { lessonId: { in: lessonIds } } });
    await prisma.resource.deleteMany({ where: { lessonId: { in: lessonIds } } });
    
    // 4. Delete the lessons
    await prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } });

    // 5. Delete the subjects
    await prisma.subject.deleteMany({ where: { id: { in: subjectIds } } });

    // 6. Finally delete the category
    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/posts");
    revalidatePath("/admin/subjects");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Delete Category Error:", error);
    return { error: "حدث خطأ أثناء الحذف" };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const communityPassword = formData.get("communityPassword") as string || null;

  if (!name) return { error: "الاسم مطلوب" };

  try {
    await prisma.category.update({
      where: { id },
      data: { name, description, communityPassword }
    });
    revalidatePath("/admin/subjects");
    revalidatePath("/courses");
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء التحديث" };
  }
}

export async function updateLesson(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const resourcesData = formData.get("resources") as string;
    const resources = resourcesData ? JSON.parse(resourcesData) : [];

    // Extract first of each type for legacy fields
    const firstVideo = resources.find((r: any) => r.type === "VIDEO")?.url || "";
    const firstPdf = resources.find((r: any) => r.type === "PDF")?.url || "";
    const firstSummary = resources.find((r: any) => r.type === "SUMMARY")?.url || "";

    await prisma.lesson.update({
      where: { id },
      data: {
        title,
        description,
        videoUrl: firstVideo,
        pdfUrl: firstPdf,
        summaryUrl: firstSummary,
        resources: {
          deleteMany: {}, // Clear old resources
          create: resources.map((r: any) => ({
            title: r.title,
            type: r.type,
            url: r.url
          }))
        }
      },
    });

    revalidatePath("/admin/posts");
    revalidatePath("/courses");
    revalidatePath(`/courses/${id}`);
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء التعديل" };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.comment.deleteMany({ where: { userId: id } });
    await prisma.favorite.deleteMany({ where: { userId: id } });
    await prisma.progress.deleteMany({ where: { userId: id } });
    
    // Check if gPACalculation model exists in prisma before trying to delete
    if ((prisma as any).gPACalculation) {
      await (prisma as any).gPACalculation.deleteMany({ where: { userId: id } });
    }
    
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Delete User Error:", error);
    return { error: "حدث خطأ أثناء حذف المستخدم" };
  }
}

export async function searchContent(query: string) {
  if (!query) return { lessons: [], categories: [], subjects: [] };

  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } }
        ],
        isPublished: true
      },
      include: { subject: { include: { category: true } } },
      take: 5
    });

    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } }
        ]
      },
      take: 5
    });

    const subjects = await prisma.subject.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } }
        ]
      },
      include: { category: true },
      take: 5
    });

    return { lessons, categories, subjects };
  } catch (error) {
    return { lessons: [], categories: [], subjects: [] };
  }
}




/** حفظ معدل مستخدم */
export async function saveGPA(userId: string, gpa: string, subjects: any[], yearName?: string) {
  try {
    // محاولة التحديث إذا كان موجوداً لنفس السنة، أو إنشاء سجل جديد
    // بما أن الجدول لا يحتوي على yearName حالياً، سنقوم بدمجه في الـ JSON مؤقتاً لضمان عدم كسر قاعدة البيانات
    const dataWithYear = {
      yearName,
      subjects
    };

    await (prisma as any).gPACalculation.create({
      data: {
        userId,
        gpa,
        subjects: JSON.stringify(dataWithYear)
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Save GPA Error:", error);
    return { error: "حدث خطأ أثناء حفظ النتيجة" };
  }
}


export async function getSavedGPA(userId: string) {
  try {
    return await (prisma as any).gPACalculation.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    return null;
  }
}

export async function getAllGPACalculations() {
  try {
    return await (prisma as any).gPACalculation.findMany({
      include: {
        user: {
          select: { name: true, email: true, image: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    return [];
  }
}

export async function deleteGPACalculation(id: string) {
  try {
    await (prisma as any).gPACalculation.delete({
      where: { id }
    });
    revalidatePath("/admin/gpa");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}

