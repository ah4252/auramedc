"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/** تنظيف المنشورات القديمة (أكبر من 24 ساعة) */
export async function cleanupDiscussions() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await prisma.discussion.deleteMany({
      where: {
        createdAt: {
          lt: twentyFourHoursAgo
        }
      }
    });
  } catch (error) {
    console.error("Error cleaning up discussions:", error);
  }
}

/** جلب المنشورات بناءً على المادة أو الفئة (السنة الدراسية) */
export async function getDiscussions(subjectId?: string, categoryId?: string) {
  try {
    // نقوم بالتنظيف فقط عند الجلب لضمان حداثة البيانات
    await cleanupDiscussions();

    const where: any = {};
    if (subjectId) {
      where.subjectId = subjectId;
    } else if (categoryId) {
      // جلب جميع المواد التابعة لهذه الفئة
      const categorySubjects = await prisma.subject.findMany({
        where: { categoryId },
        select: { id: true }
      });
      const subjectIds = categorySubjects.map(s => s.id);

      where.OR = [
        { categoryId: categoryId }, // منشورات عامة في الفئة
        { subjectId: { in: subjectIds } } // منشورات في مواد تابعة للفئة
      ];
    }

    const discussions = await prisma.discussion.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true, telegram: true, instagram: true, facebook: true } },
        subject: { select: { id: true, name: true, categoryId: true } },
        likes: true,
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return discussions;
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return [];
  }
}

/** جلب منشور واحد مع تعليقاته */
export async function getDiscussion(id: string) {
  try {
    const discussion = await prisma.discussion.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, image: true, telegram: true, instagram: true, facebook: true } },
        subject: { select: { id: true, name: true, categoryId: true } },
        likes: true,
        comments: {
          include: {
            user: { select: { id: true, name: true, image: true } },
            replies: {
              include: {
                user: { select: { id: true, name: true, image: true } }
              },
              orderBy: { createdAt: "asc" }
            }
          },
          where: { parentId: null }, // جلب التعليقات الرئيسية فقط، الردود تأتي متداخلة
          orderBy: { createdAt: "asc" }
        }
      }
    });
    return discussion;
  } catch (error) {
    console.error("Error fetching discussion:", error);
    return null;
  }
}

/** إنشاء منشور جديد */
export async function createDiscussion(userId: string, title: string, content: string, subjectId?: string, categoryId?: string) {
  try {
    const newDiscussion = await prisma.discussion.create({
      data: {
        title,
        content,
        userId,
        subjectId: subjectId || null,
        categoryId: categoryId || null
      } as any,
      include: {
        user: { select: { id: true, name: true, image: true, telegram: true, instagram: true, facebook: true } },
        subject: { select: { id: true, name: true, categoryId: true } },
        _count: { select: { comments: true } }
      }
    });

    // تهيئة مصفوفة الإعجابات الفارغة للعرض المباشر
    (newDiscussion as any).likes = [];

    revalidatePath("/community", "layout");
    revalidatePath("/", "layout");
    
    return { success: true, discussion: newDiscussion };
  } catch (error: any) {
    console.error("Error creating discussion:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء إنشاء المنشور" };
  }
}

/** تحديث منشور */
export async function updateDiscussion(id: string, userId: string, title: string, content: string) {
  try {
    const isAdmin = userId === "secure_session_token";
    
    let user = null;
    if (!isAdmin) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });
    }

    const where: any = { id };
    if (!isAdmin && user?.role !== "ADMIN") {
      where.userId = userId;
    }

    await prisma.discussion.update({
      where,
      data: { title, content }
    });
    revalidatePath("/community", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating discussion:", error);
    return { success: false, error: "حدث خطأ أثناء تحديث المنشور" };
  }
}

/** حذف منشور */
export async function deleteDiscussion(id: string, userId: string) {
  try {
    // التحقق من صلاحيات المستخدم (صاحب المنشور أو مدير)
    // ملاحظة: الـ admin_token في هذا المشروع هو "secure_session_token"
    const isAdmin = userId === "secure_session_token";
    
    let user = null;
    if (!isAdmin) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });
    }

    const where: any = { id };
    // إذا لم يكن مديراً بالتوكن ولم يكن مديراً في قاعدة البيانات، يجب أن يكون هو صاحب المنشور
    if (!isAdmin && user?.role !== "ADMIN") {
      where.userId = userId;
    }

    await prisma.discussion.delete({
      where
    });
    revalidatePath("/community", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error deleting discussion:", error);
    return { success: false, error: "حدث خطأ أثناء حذف المنشور" };
  }
}

/** إضافة تعليق */
export async function addComment(userId: string, discussionId: string, content: string, parentId?: string) {
  try {
    await prisma.discussionComment.create({
      data: {
        content,
        userId,
        discussionId,
        parentId: parentId || null
      }
    });
    revalidatePath(`/community/d/${discussionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "حدث خطأ أثناء إضافة التعليق" };
  }
}

/** حذف تعليق */
export async function deleteDiscussionComment(id: string, userId: string, discussionId: string) {
  try {
    const isAdmin = userId === "secure_session_token";
    
    let user = null;
    if (!isAdmin) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });
    }

    const where: any = { id };
    if (!isAdmin && user?.role !== "ADMIN") {
      where.userId = userId;
    }

    await prisma.discussionComment.delete({
      where
    });
    revalidatePath(`/community/d/${discussionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false };
  }
}

/** الإعجاب بمنشور أو إلغاؤه */
export async function toggleLike(userId: string, discussionId: string) {
  try {
    const existing = await prisma.like.findFirst({
      where: { userId, discussionId }
    });

    if (existing) {
      await prisma.like.delete({
        where: { id: existing.id }
      });
    } else {
      await prisma.like.create({
        data: { userId, discussionId }
      });
    }

    revalidatePath("/community", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false };
  }
}

/** تحديث كلمة مرور المجتمع لفئة معينة (للمشرفين) */
export async function updateCommunityPassword(categoryId: string, password?: string | null) {
  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: { communityPassword: password }
    });
    revalidatePath("/community", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating community password:", error);
    return { success: false };
  }
}
