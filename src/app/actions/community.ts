"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function cleanupDiscussions() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await (prisma as any).discussion.deleteMany({
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

export async function getDiscussions(subjectId?: string, categoryId?: string) {
  try {
    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (categoryId) {
      const categorySubjects = await prisma.subject.findMany({
        where: { categoryId },
        select: { id: true }
      });
      const subjectIds = categorySubjects.map(s => s.id);

      where.OR = [
        { categoryId: categoryId },
        { subjectId: { in: subjectIds } }
      ];
    }

    // 1. Fetch discussions without social fields to avoid Prisma validation error
    const discussions = await (prisma as any).discussion.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        subject: { select: { name: true, categoryId: true } },
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    // 2. Manually augment users with social links via Raw SQL
    for (const d of discussions) {
      if (d.user?.id) {
        const socialData: any[] = await prisma.$queryRaw`
          SELECT telegram, instagram, facebook FROM "User" WHERE id = ${d.user.id}
        `;
        if (socialData.length > 0) {
          d.user.telegram = socialData[0].telegram;
          d.user.instagram = socialData[0].instagram;
          d.user.facebook = socialData[0].facebook;
        }
      }

      // Manually fetch likes
      const likes: any[] = await prisma.$queryRaw`SELECT * FROM "Like" WHERE discussionId = ${d.id}`;
      d.likes = likes;
    }

    return discussions;
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return [];
  }
}

export async function getDiscussion(id: string) {
  try {
    // 1. Safely increment views using raw SQL (no crash if deleted)
    await prisma.$executeRaw`
      UPDATE "Discussion" SET views = views + 1 WHERE id = ${id}
    `;

    // 2. Fetch discussion (social fields fetched later)
    const discussion = await (prisma as any).discussion.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, image: true } },
        subject: { select: { name: true } }
      }
    });

    if (!discussion) return null;

    if (discussion && discussion.user) {
      const socialData: any[] = await prisma.$queryRaw`
        SELECT telegram, instagram, facebook FROM "User" WHERE id = ${discussion.user.id}
      `;
      if (socialData.length > 0) {
        discussion.user.telegram = socialData[0].telegram;
        discussion.user.instagram = socialData[0].instagram;
        discussion.user.facebook = socialData[0].facebook;
      }
    }

    // Comments & Replies
    const comments: any[] = await prisma.$queryRaw`
      SELECT c.*, u.name as "userName", u.image as "userImage", u.telegram, u.instagram, u.facebook 
       FROM "DiscussionComment" c 
       LEFT JOIN "User" u ON c.userId = u.id 
       WHERE c.discussionId = ${id} AND c.parentId IS NULL 
       ORDER BY c.createdAt DESC
    `;

    for (const c of comments) {
      c.user = { 
        name: c.userName, 
        image: c.userImage,
        telegram: c.telegram,
        instagram: c.instagram,
        facebook: c.facebook
      };
      const replies: any[] = await prisma.$queryRaw`
        SELECT r.*, u.name as "userName", u.image as "userImage", u.telegram, u.instagram, u.facebook 
         FROM "DiscussionComment" r 
         LEFT JOIN "User" u ON r.userId = u.id 
         WHERE r.parentId = ${c.id} 
         ORDER BY r.createdAt ASC
      `;
      for (const r of replies) {
        r.user = { 
          name: r.userName, 
          image: r.userImage,
          telegram: r.telegram,
          instagram: r.instagram,
          facebook: r.facebook
        };
      }
      c.replies = replies;
    }

    const likes: any[] = await prisma.$queryRaw`SELECT * FROM "Like" WHERE discussionId = ${id}`;
    
    return { ...discussion, comments, likes };
  } catch (error) {
    console.error("Error fetching discussion:", error);
    return null;
  }
}

export async function createDiscussion(userId: string, title: string, content: string, subjectId?: string, categoryId?: string) {
  try {
    const newDiscussion = await (prisma as any).discussion.create({
      data: {
        title,
        content,
        userId,
        subjectId: subjectId || null,
        categoryId: categoryId || null
      },
      include: {
        user: { select: { name: true, image: true } },
        subject: { select: { name: true } }
      }
    });

    // Augment with social data
    const socialData: any[] = await prisma.$queryRaw`
      SELECT telegram, instagram, facebook FROM "User" WHERE id = ${userId}
    `;
    if (socialData.length > 0) {
      newDiscussion.user.telegram = socialData[0].telegram;
      newDiscussion.user.instagram = socialData[0].instagram;
      newDiscussion.user.facebook = socialData[0].facebook;
    }

    newDiscussion.likes = [];
    newDiscussion._count = { comments: 0 };

    revalidatePath("/community", "layout");
    revalidatePath("/", "layout");
    return { success: true, discussion: newDiscussion };
  } catch (error) {
    console.error("Error creating discussion:", error);
    return { success: false, error: "حدث خطأ أثناء إنشاء المنشور" };
  }
}

export async function addComment(userId: string, discussionId: string, content: string, parentId?: string) {
  try {
    await prisma.$executeRaw`
      INSERT INTO "DiscussionComment" (id, content, userId, discussionId, parentId, createdAt, updatedAt) 
       VALUES (${Math.random().toString(36).substring(7)}, ${content}, ${userId}, ${discussionId}, ${parentId || null}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    revalidatePath(`/community/d/${discussionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "حدث خطأ أثناء إضافة التعليق" };
  }
}

export async function toggleLike(userId: string, discussionId: string) {
  try {
    const existing: any[] = await prisma.$queryRaw`
      SELECT id FROM "Like" WHERE userId = ${userId} AND discussionId = ${discussionId}
    `;

    if (existing.length > 0) {
      await prisma.$executeRaw`DELETE FROM "Like" WHERE id = ${existing[0].id}`;
    } else {
      await prisma.$executeRaw`
        INSERT INTO "Like" (id, userId, discussionId, createdAt) VALUES (${Math.random().toString(36).substring(7)}, ${userId}, ${discussionId}, CURRENT_TIMESTAMP)
      `;
    }
    revalidatePath("/community", "layout");
    return { success: true };
  } catch (error) {
    return { error: "Error toggling like" };
  }
}

export async function updateDiscussion(id: string, userId: string, title: string, content: string) {
  try {
    await (prisma as any).discussion.update({
      where: { id, userId },
      data: { title, content }
    });
    revalidatePath("/community", "layout");
    revalidatePath(`/community/d/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء التحديث" };
  }
}

export async function deleteDiscussion(id: string) {
  try {
    await (prisma as any).discussion.delete({ where: { id } });
    revalidatePath("/community", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteDiscussionComment(id: string, discussionId: string) {
  try {
    await prisma.$executeRaw`DELETE FROM "DiscussionComment" WHERE id = ${id} OR parentId = ${id}`;
    revalidatePath(`/community/d/${discussionId}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function updateCommunityPassword(categoryId: string, password: string | null) {
  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: { communityPassword: password }
    });
    revalidatePath("/community", "layout");
    revalidatePath("/admin/community");
    return { success: true };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء تحديث كلمة المرور" };
  }
}
