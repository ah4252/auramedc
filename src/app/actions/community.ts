"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function cleanupDiscussions() {
  try {
    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
    await (prisma as any).discussion.deleteMany({
      where: {
        createdAt: {
          lt: fiveHoursAgo
        }
      }
    });
  } catch (error) {
    console.error("Error cleaning up discussions:", error);
  }
}

export async function getDiscussions(subjectId?: string, categoryId?: string) {
  try {
    await cleanupDiscussions();

    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (categoryId) {
      where.subject = {
        categoryId: categoryId
      };
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
        const socialData: any[] = await prisma.$queryRawUnsafe(
          `SELECT telegram, instagram, facebook FROM "User" WHERE id = ?`,
          d.user.id
        );
        if (socialData.length > 0) {
          d.user.telegram = socialData[0].telegram;
          d.user.instagram = socialData[0].instagram;
          d.user.facebook = socialData[0].facebook;
        }
      }

      // Manually fetch likes
      const likes: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "Like" WHERE discussionId = ?`, d.id);
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
    await prisma.$executeRawUnsafe(
      `UPDATE Discussion SET views = views + 1 WHERE id = ?`,
      id
    );

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
      const socialData: any[] = await prisma.$queryRawUnsafe(
        `SELECT telegram, instagram, facebook FROM "User" WHERE id = ?`,
        discussion.user.id
      );
      if (socialData.length > 0) {
        discussion.user.telegram = socialData[0].telegram;
        discussion.user.instagram = socialData[0].instagram;
        discussion.user.facebook = socialData[0].facebook;
      }
    }

    // Comments & Replies
    const comments: any[] = await prisma.$queryRawUnsafe(
      `SELECT c.*, u.name as "userName", u.image as "userImage", u.telegram, u.instagram, u.facebook 
       FROM "DiscussionComment" c 
       LEFT JOIN "User" u ON c.userId = u.id 
       WHERE c.discussionId = ? AND c.parentId IS NULL 
       ORDER BY c.createdAt DESC`,
      id
    );

    for (const c of comments) {
      c.user = { 
        name: c.userName, 
        image: c.userImage,
        telegram: c.telegram,
        instagram: c.instagram,
        facebook: c.facebook
      };
      const replies: any[] = await prisma.$queryRawUnsafe(
        `SELECT r.*, u.name as "userName", u.image as "userImage", u.telegram, u.instagram, u.facebook 
         FROM "DiscussionComment" r 
         LEFT JOIN "User" u ON r.userId = u.id 
         WHERE r.parentId = ? 
         ORDER BY r.createdAt ASC`,
        c.id
      );
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

    const likes: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "Like" WHERE discussionId = ?`, id);
    
    return { ...discussion, comments, likes };
  } catch (error) {
    console.error("Error fetching discussion:", error);
    return null;
  }
}

export async function createDiscussion(userId: string, title: string, content: string, subjectId?: string) {
  try {
    const newDiscussion = await (prisma as any).discussion.create({
      data: {
        title,
        content,
        userId,
        subjectId: subjectId || null
      },
      include: {
        user: { select: { name: true, image: true } },
        subject: { select: { name: true } }
      }
    });

    // Augment with social data
    const socialData: any[] = await prisma.$queryRawUnsafe(
      `SELECT telegram, instagram, facebook FROM "User" WHERE id = ?`,
      userId
    );
    if (socialData.length > 0) {
      newDiscussion.user.telegram = socialData[0].telegram;
      newDiscussion.user.instagram = socialData[0].instagram;
      newDiscussion.user.facebook = socialData[0].facebook;
    }

    newDiscussion.likes = [];
    newDiscussion._count = { comments: 0 };

    revalidatePath("/community");
    return { success: true, discussion: newDiscussion };
  } catch (error) {
    console.error("Error creating discussion:", error);
    return { error: "حدث خطأ أثناء إنشاء المنشور" };
  }
}

export async function addComment(userId: string, discussionId: string, content: string, parentId?: string) {
  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "DiscussionComment" (id, content, userId, discussionId, parentId, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      Math.random().toString(36).substring(7),
      content,
      userId,
      discussionId,
      parentId || null
    );
    revalidatePath(`/community/d/${discussionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "حدث خطأ أثناء إضافة التعليق" };
  }
}

export async function toggleLike(userId: string, discussionId: string) {
  try {
    const existing: any[] = await prisma.$queryRawUnsafe(
      `SELECT id FROM "Like" WHERE userId = ? AND discussionId = ?`,
      userId,
      discussionId
    );

    if (existing.length > 0) {
      await prisma.$executeRawUnsafe(`DELETE FROM "Like" WHERE id = ?`, existing[0].id);
    } else {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Like" (id, userId, discussionId, createdAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        Math.random().toString(36).substring(7),
        userId,
        discussionId
      );
    }
    revalidatePath("/community");
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
    revalidatePath("/community");
    revalidatePath(`/community/d/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteDiscussion(id: string) {
  try {
    await (prisma as any).discussion.delete({ where: { id } });
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteDiscussionComment(id: string, discussionId: string) {
  try {
    await prisma.$executeRawUnsafe(`DELETE FROM "DiscussionComment" WHERE id = ? OR parentId = ?`, id, id);
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
    revalidatePath("/community");
    revalidatePath("/admin/community");
    return { success: true };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء تحديث كلمة المرور" };
  }
}
