"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendPushNotification } from "@/lib/push";

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

    const senderUser = await prisma.user.findUnique({ where: { id: activeUserId } });
    if (senderUser) {
      await sendPushNotification(friendId, "طلب صداقة جديد", `أرسل لك ${senderUser.name || 'مستخدم'} طلب صداقة!`, '/friends');
    }

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

    const acceptorUser = await prisma.user.findUnique({ where: { id: activeUserId } });

    // Create a server-side decision/notification for the original sender
    try {
      await prisma.friendshipDecision.create({
        data: {
          actorId: activeUserId,
          targetUserId: request.userId,
          type: "ACCEPTED",
          message: `لقد قبل ${acceptorUser?.name || 'المستخدم'} طلب صداقتك.`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }
      });
    } catch (e) {
      console.error("Failed to create friendship decision on accept:", e);
    }
    if (acceptorUser) {
      await sendPushNotification(request.userId, "تم قبول طلب الصداقة", `لقد قبل ${acceptorUser.name || 'المستخدم'} طلب صداقتك!`, '/friends');
    }

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

    const otherUserId = request.userId === activeUserId ? request.friendId : request.userId;
    if (otherUserId) {
      // Create a FriendshipDecision to persist the rejection/ cancellation for the other user
      try {
        await prisma.friendshipDecision.create({
          data: {
            actorId: activeUserId,
            targetUserId: otherUserId,
            type: "REJECTED",
            message: `تم رفض طلب الصداقة.`,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          }
        });
      } catch (e) {
        console.error("Failed to create friendship decision on reject:", e);
      }

      if (request.friendId === activeUserId) {
        await sendPushNotification(
          otherUserId,
          "تم رفض طلب الصداقة",
          `رفض ${request.friendId === activeUserId ? "مستخدم" : "العضو"} طلب صداقتك.`,
          "/friends"
        );
      }
    }

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
            studyYear: true,
            wilaya: true,
            telegram: true,
            facebook: true,
            lastActiveAt: true
          }
        },
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            studyYear: true,
            wilaya: true,
            telegram: true,
            instagram: true,
            facebook: true,
            lastActiveAt: true
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

// Get outgoing decisions (server-side) for the active user
export async function getOutgoingDecisions() {
  try {
    const activeUserId = await getActiveUserId();
    if (!activeUserId) return { success: false, error: "يجب تسجيل الدخول أولاً" };

    const now = new Date();
    const decisions = await prisma.friendshipDecision.findMany({
      where: {
        targetUserId: activeUserId,
        expiresAt: { gt: now },
        readAt: null,
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            studyYear: true,
            telegram: true,
            instagram: true,
            facebook: true,
            lastActiveAt: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, decisions };
  } catch (err) {
    console.error("getOutgoingDecisions error:", err);
    return { success: false, error: "فشل جلب إشعارات الطلبات" };
  }
}

// Mark a server-side decision as read
export async function markDecisionRead(decisionId: string) {
  try {
    const activeUserId = await getActiveUserId();
    if (!activeUserId) return { success: false, error: "يجب تسجيل الدخول أولاً" };

    const decision = await prisma.friendshipDecision.findUnique({ where: { id: decisionId } });
    if (!decision || decision.targetUserId !== activeUserId) return { success: false, error: "غير مصرح" };

    await prisma.friendshipDecision.update({ where: { id: decisionId }, data: { readAt: new Date() } });
    return { success: true };
  } catch (err) {
    console.error("markDecisionRead error:", err);
    return { success: false, error: "فشل تعليم الإشعار كمقروء" };
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
        image: true,
        studyYear: true,
        lastActiveAt: true
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

