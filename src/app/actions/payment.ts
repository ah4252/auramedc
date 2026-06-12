"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { isAdmin as checkIsAdmin } from "@/lib/auth-helpers";

export async function submitSubscriptionRequest(transactionId: string, paymentDate: string) {
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

    await (prisma as any).subscriptionRequest.update({
      where: { id: requestId },
      data: { status: newStatus }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating subscription status:", error);
    return { error: "فشل تحديث الحالة" };
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
