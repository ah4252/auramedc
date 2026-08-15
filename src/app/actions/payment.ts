"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { isAdmin as checkIsAdmin, isSubscriptionExemptEmail } from "@/lib/auth-helpers";

function isQcmSubscriptionTransactionId(transactionId: string | null | undefined): boolean {
  const value = String(transactionId ?? "").trim();
  if (!value) return false;

  if (/^(QCM|ALL)(:|$)/i.test(value)) return true;
  if (/^(GPA|TIMETABLE|SUPPORT)(:|$)/i.test(value)) return false;

  return !value.includes(":");
}

export async function submitSubscriptionRequest(transactionId: string, paymentDate: string, receiptUrl?: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_token")?.value;

    if (!userId) {
      return { error: "يرجى تسجيل الدخول أولاً" };
    }

    const parsedDate = new Date(paymentDate);
    if (isNaN(parsedDate.getTime())) {
      return { error: "تاريخ غير صالح" };
    }

    await (prisma as any).subscriptionRequest.create({
      data: {
        userId,
        transactionId,
        paymentDate: parsedDate,
        receiptUrl,
        status: "PENDING",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting subscription request:", error);
    return { error: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى." };
  }
}

export async function updateSubscriptionStatus(requestId: string, newStatus: string) {
  try {
    const adminPrivileges = await checkIsAdmin();
    if (!adminPrivileges) {
      return { error: "صلاحيات إدارية مطلوبة" };
    }

    const request = await (prisma as any).subscriptionRequest.findUnique({
      where: { id: requestId },
    });

    const isQcmRequest = isQcmSubscriptionTransactionId(request?.transactionId);

    await (prisma as any).subscriptionRequest.update({
      where: { id: requestId },
      data: {
        status: newStatus,
        ...(newStatus === "APPROVED" && isQcmRequest ? { usedViews: 0, maxViews: 5 } : {}),
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating subscription status:", error);
    return { error: "فشل تحديث الحالة" };
  }
}

export async function getQcmRemainingViews() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_token")?.value;

    if (!userId) {
      return { allowed: false, remaining: 0, maxViews: 5 };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (isSubscriptionExemptEmail(user?.email ?? null)) {
      return { allowed: true, remaining: 5, maxViews: 5 };
    }

    const requests = await (prisma as any).subscriptionRequest.findMany({
      where: {
        userId,
        status: "APPROVED",
      },
      orderBy: { createdAt: "desc" },
    });

    const request = requests.find((item: any) => isQcmSubscriptionTransactionId(item?.transactionId)) ?? null;

    if (!request) {
      return { allowed: false, remaining: 0, maxViews: 5 };
    }

    const maxViews = Number(request.maxViews ?? 5);
    const usedViews = Number(request.usedViews ?? 0);
    const remaining = Math.max(0, maxViews - usedViews);

    return {
      allowed: usedViews < maxViews,
      remaining,
      maxViews,
    };
  } catch (error) {
    console.error("Error reading QCM remaining views:", error);
    return { allowed: false, remaining: 0, maxViews: 5 };
  }
}

export async function consumeQcmView() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_token")?.value;

    if (!userId) {
      return { allowed: false, remaining: 0, message: "login" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (isSubscriptionExemptEmail(user?.email ?? null)) {
      return { allowed: true, remaining: 5, message: "ok" };
    }

    const requests = await (prisma as any).subscriptionRequest.findMany({
      where: {
        userId,
        status: "APPROVED",
      },
      orderBy: { createdAt: "desc" },
    });

    const request = requests.find((item: any) => isQcmSubscriptionTransactionId(item?.transactionId)) ?? null;

    if (!request) {
      return { allowed: false, remaining: 0, message: "missing" };
    }

    const maxViews = Number(request.maxViews ?? 5);
    const usedViews = Number(request.usedViews ?? 0);

    if (usedViews >= maxViews) {
      await (prisma as any).subscriptionRequest.update({
        where: { id: request.id },
        data: { status: "EXPIRED" },
      });
      return { allowed: false, remaining: 0, message: "limit_reached" };
    }

    const nextUsedViews = usedViews + 1;
    await (prisma as any).subscriptionRequest.update({
      where: { id: request.id },
      data: { usedViews: nextUsedViews },
    });

    return {
      allowed: true,
      remaining: Math.max(0, maxViews - nextUsedViews),
      message: "ok",
    };
  } catch (error) {
    console.error("Error consuming QCM view:", error);
    return { allowed: false, remaining: 0, message: "error" };
  }
}

export async function deleteSubscriptionRequests(requestIds: string[]) {
  try {
    const adminPrivileges = await checkIsAdmin();
    if (!adminPrivileges) {
      return { error: "صلاحيات إدارية مطلوبة" };
    }

    await (prisma as any).subscriptionRequest.deleteMany({
      where: { id: { in: requestIds } }
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting subscription requests:", error);
    return { error: "فشل الحذف" };
  }
}
