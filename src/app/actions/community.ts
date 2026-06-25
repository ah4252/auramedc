"use server";

import { revalidatePath } from "next/cache";

export async function cleanupDiscussions() {
  return;
}

export async function getDiscussions(subjectId?: string, categoryId?: string) {
  return [];
}

export async function getDiscussion(id: string) {
  return null;
}

export async function createDiscussion(userId: string, title: string, content: string, subjectId?: string, categoryId?: string) {
  return { success: false, error: "Community feature is disabled.", discussion: null as any };
}

export async function updateDiscussion(id: string, userId: string, title: string, content: string) {
  return { success: false, error: "Community feature is disabled." };
}

export async function deleteDiscussion(id: string, userId: string) {
  return { success: false, error: "Community feature is disabled." };
}

export async function addComment(userId: string, discussionId: string, content: string, parentId?: string) {
  return { success: false, error: "Community feature is disabled." };
}

export async function deleteDiscussionComment(id: string, userId: string, discussionId: string) {
  return { success: false };
}

export async function toggleLike(userId: string, discussionId: string) {
  return { success: false };
}

export async function updateCommunityPassword(categoryId: string, password?: string | null) {
  return { success: false };
}
