"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Get active logged-in user id
async function getActiveUserId() {
  const cookieStore = await cookies();
  return cookieStore.get("user_token")?.value;
}

// Search user by email
export async function searchUserByEmail(email: string) {
  try {
    const activeUserId = await getActiveUserId();
    if (!activeUserId) return { success: false, error: "يجب تسجيل الدخول أولاً" };

    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    });

    if (!user) {
      return { success: false, error: "لم يتم العثور على أي مستخدم بهذا البريد الإلكتروني" };
    }

    if (user.id === activeUserId) {
      return { success: true, user, isSelf: true, status: "SELF" };
    }

    // Check existing friendship relation
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: activeUserId, friendId: user.id },
          { userId: user.id, friendId: activeUserId }
        ]
      }
    });

    let status = "NONE"; // NONE, PENDING_SENT, PENDING_RECEIVED, ACCEPTED
    let requestId = null;

    if (friendship) {
      requestId = friendship.id;
      if (friendship.status === "ACCEPTED") {
        status = "ACCEPTED";
      } else if (friendship.userId === activeUserId) {
        status = "PENDING_SENT";
      } else {
        status = "PENDING_RECEIVED";
      }
    }

    return { success: true, user, status, requestId };
  } catch (err) {
    console.error("SearchUserByEmail Error:", err);
    return { success: false, error: "حدث خطأ أثناء البحث عن المستخدم" };
  }
}

// Send Friend Request
export async function sendFriendRequest(friendId: string) {
  try {
    const activeUserId = await getActiveUserId();
    if (!activeUserId) return { success: false, error: "يجب تسجيل الدخول أولاً" };
    if (activeUserId === friendId) return { success: false, error: "لا يمكنك إضافة نفسك كصديق" };

    // Check if relation already exists
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: activeUserId, friendId },
          { userId: friendId, friendId: activeUserId }
        ]
      }
    });

    if (existing) {
      return { success: false, error: "يوجد طلب صداقة أو علاقة قائمة بالفعل مع هذا المستخدم" };
    }

    await prisma.friendship.create({
      data: {
        userId: activeUserId,
        friendId,
        status: "PENDING"
      }
    });

    revalidatePath("/friends");
    return { success: true };
  } catch (err) {
    console.error("SendFriendRequest Error:", err);
    return { success: false, error: "فشل إرسال طلب الصداقة" };
  }
}

// Accept Friend Request
export async function acceptFriendRequest(requestId: string) {
  try {
    const activeUserId = await getActiveUserId();
    if (!activeUserId) return { success: false, error: "يجب تسجيل الدخول أولاً" };

    const request = await prisma.friendship.findUnique({
      where: { id: requestId }
    });

    if (!request || request.friendId !== activeUserId) {
      return { success: false, error: "طلب الصداقة هذا غير صالح أو غير موجه إليك" };
    }

    await prisma.friendship.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" }
    });

    revalidatePath("/friends");
    return { success: true };
  } catch (err) {
    console.error("AcceptFriendRequest Error:", err);
    return { success: false, error: "فشل قبول طلب الصداقة" };
  }
}

// Reject / Cancel Friend Request (Delete record)
export async function rejectFriendRequest(requestId: string) {
  try {
    const activeUserId = await getActiveUserId();
    if (!activeUserId) return { success: false, error: "يجب تسجيل الدخول أولاً" };

    const request = await prisma.friendship.findUnique({
      where: { id: requestId }
    });

    if (!request || (request.userId !== activeUserId && request.friendId !== activeUserId)) {
      return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
    }

    await prisma.friendship.delete({
      where: { id: requestId }
    });

    revalidatePath("/friends");
    return { success: true };
  } catch (err) {
    console.error("RejectFriendRequest Error:", err);
    return { success: false, error: "فشل إلغاء أو رفض طلب الصداقة" };
  }
}

// Unfriend / Remove Friend (Delete record by friend user ID)
export async function removeFriend(friendId: string) {
  try {
    const activeUserId = await getActiveUserId();
    if (!activeUserId) return { success: false, error: "يجب تسجيل الدخول أولاً" };

    const friendship = await prisma.friendship.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { userId: activeUserId, friendId },
          { userId: friendId, friendId: activeUserId }
        ]
      }
    });

    if (!friendship) {
      return { success: false, error: "لا توجد علاقة صداقة نشطة مع هذا المستخدم" };
    }

    await prisma.friendship.delete({
      where: { id: friendship.id }
    });

    revalidatePath("/friends");
    return { success: true };
  } catch (err) {
    console.error("RemoveFriend Error:", err);
    return { success: false, error: "فشل إلغاء الصداقة" };
  }
}

// Get Friends Data
export async function getFriendsData() {
  try {
    const activeUserId = await getActiveUserId();
    if (!activeUserId) return { success: false, error: "يجب تسجيل الدخول أولاً" };

    // Fetch all friendships where active user is involved
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: activeUserId },
          { friendId: activeUserId }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            telegram: true,
            instagram: true,
            facebook: true
          }
        },
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            telegram: true,
            instagram: true,
            facebook: true
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    const friends: any[] = [];
    const incomingRequests: any[] = [];
    const outgoingRequests: any[] = [];

    friendships.forEach(f => {
      // Determine if the other person is the friend
      const otherUser = f.userId === activeUserId ? f.friend : f.user;

      if (f.status === "ACCEPTED") {
        friends.push({
          friendshipId: f.id,
          user: otherUser
        });
      } else if (f.userId === activeUserId) {
        outgoingRequests.push({
          friendshipId: f.id,
          user: otherUser
        });
      } else {
        incomingRequests.push({
          friendshipId: f.id,
          user: otherUser
        });
      }
    });

    return {
      success: true,
      friends,
      incomingRequests,
      outgoingRequests
    };
  } catch (err) {
    console.error("GetFriendsData Error:", err);
    return { success: false, error: "فشل جلب قائمة الأصدقاء" };
  }
}

// Search Users Live (Debounced autocomplete)
export async function searchUsersLive(query: string) {
  try {
    const activeUserId = await getActiveUserId();
    if (!activeUserId) return { success: false, error: "يجب تسجيل الدخول أولاً" };

    const cleanQuery = query.trim().toLowerCase();
    if (cleanQuery.length < 2) {
      return { success: true, users: [] };
    }

    // Find up to 5 matching users
    const matchedUsers = await prisma.user.findMany({
      where: {
        email: {
          contains: cleanQuery
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      },
      take: 5
    });

    // For each matched user, find current friendship status
    const usersWithStatus = await Promise.all(
      matchedUsers.map(async (u) => {
        if (u.id === activeUserId) {
          return { ...u, status: "SELF", requestId: null };
        }

        const friendship = await prisma.friendship.findFirst({
          where: {
            OR: [
              { userId: activeUserId, friendId: u.id },
              { userId: u.id, friendId: activeUserId }
            ]
          }
        });

        let status = "NONE";
        let requestId = null;

        if (friendship) {
          requestId = friendship.id;
          if (friendship.status === "ACCEPTED") {
            status = "ACCEPTED";
          } else if (friendship.userId === activeUserId) {
            status = "PENDING_SENT";
          } else {
            status = "PENDING_RECEIVED";
          }
        }

        return { ...u, status, requestId };
      })
    );

    return { success: true, users: usersWithStatus };
  } catch (err) {
    console.error("searchUsersLive error:", err);
    return { success: false, error: "حدث خطأ أثناء البحث" };
  }
}

