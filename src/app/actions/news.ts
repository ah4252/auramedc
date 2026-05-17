"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Automatic Cleanup of Comments older than 4 hours
export async function cleanupOldComments() {
  try {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const result = await prisma.newsComment.deleteMany({
      where: {
        createdAt: {
          lt: fourHoursAgo
        }
      }
    });
    if (result.count > 0) {
      console.log(`[Auto Cleanup] Successfully deleted ${result.count} comments older than 4 hours.`);
    }
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error during automatic comment cleanup:", error);
    return { success: false, error: "Failed to cleanup comments" };
  }
}

export async function getNews(onlyPublished = false) {
  try {
    // Run cleanup on fetch
    await cleanupOldComments();

    const news = await prisma.news.findMany({
      where: onlyPublished ? { isPublished: true } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        comments: {
          where: { parentId: null }, // Only fetch root comments
          include: {
            user: {
              select: { id: true, name: true, image: true }
            },
            replies: {
              include: {
                user: {
                  select: { id: true, name: true, image: true }
                }
              },
              orderBy: { createdAt: "asc" } // Show replies in natural order (oldest first)
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    return news;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function getNewsById(id: string) {
  try {
    // Run cleanup on fetch
    await cleanupOldComments();

    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        comments: {
          where: { parentId: null },
          include: {
            user: {
              select: { id: true, name: true, image: true }
            },
            replies: {
              include: {
                user: {
                  select: { id: true, name: true, image: true }
                }
              },
              orderBy: { createdAt: "asc" }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    return news;
  } catch (error) {
    console.error("Error fetching news by id:", error);
    return null;
  }
}

export async function createNews(data: { title: string; content: string; image?: string; videoUrl?: string; fileUrl?: string; isPublished?: boolean }) {
  try {
    const news = await prisma.news.create({
      data,
    });
    revalidatePath("/news");
    revalidatePath("/admin/news");
    revalidatePath("/profile");
    return { success: true, news };
  } catch (error) {
    console.error("Error creating news:", error);
    return { success: false, error: "Failed to create news" };
  }
}

export async function updateNews(id: string, data: { title?: string; content?: string; image?: string; videoUrl?: string; fileUrl?: string; isPublished?: boolean }) {
  try {
    const news = await prisma.news.update({
      where: { id },
      data,
    });
    revalidatePath("/news");
    revalidatePath("/admin/news");
    revalidatePath("/profile");
    return { success: true, news };
  } catch (error) {
    console.error("Error updating news:", error);
    return { success: false, error: "Failed to update news" };
  }
}

export async function deleteNews(id: string) {
  try {
    await prisma.news.delete({
      where: { id },
    });
    revalidatePath("/news");
    revalidatePath("/admin/news");
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error deleting news:", error);
    return { success: false, error: "Failed to delete news" };
  }
}

// Add Comment or Reply Action
export async function addNewsComment(newsId: string, content: string, parentId?: string) {
  try {
    // Run cleanup to keep database tidy
    await cleanupOldComments();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_token")?.value;
    
    if (!userId) {
      return { success: false, error: "يجب تسجيل الدخول لإضافة تعليق" };
    }

    const comment = await prisma.newsComment.create({
      data: {
        content,
        newsId,
        userId,
        parentId: parentId || null
      },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        },
        replies: {
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          }
        }
      }
    });
    
    revalidatePath("/news");
    return { success: true, comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

export async function deleteNewsComment(commentId: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_token")?.value;
    const adminToken = cookieStore.get("admin_token")?.value;
    
    if (!userId && !adminToken) {
      return { success: false, error: "غير مصرح لك بحذف هذا التعليق" };
    }

    const comment = await prisma.newsComment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return { success: false, error: "التعليق غير موجود" };
    }

    // Auth check: Owner of comment OR admin
    if (comment.userId !== userId && !adminToken) {
      return { success: false, error: "غير مصرح لك بحذف هذا التعليق" };
    }

    await prisma.newsComment.delete({
      where: { id: commentId }
    });

    revalidatePath("/news");
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, error: "حدث خطأ أثناء حذف التعليق" };
  }
}

