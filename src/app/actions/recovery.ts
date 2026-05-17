"use server";

import { prisma } from "@/lib/db";

// Create a new forgot password recovery request
export async function createRecoveryRequest(email: string, lastPassword: string) {
  if (!email || !lastPassword) {
    return { error: "الرجاء تعبئة كافة الحقول المطلوبة" };
  }

  try {
    // Verify if user exists first
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "لا يوجد حساب مسجل بهذا البريد الإلكتروني" };
    }

    // Check if there's already a pending request for this email to avoid duplicates
    const existing = await prisma.forgotPasswordRequest.findFirst({
      where: { email, status: "PENDING" }
    });

    if (existing) {
      return { success: true, message: "لديك طلب معلق بالفعل، ينتظر معالجة المطور." };
    }

    // Create request
    await prisma.forgotPasswordRequest.create({
      data: {
        email,
        lastPassword,
        status: "PENDING"
      }
    });

    return { success: true };
  } catch (err) {
    console.error("CreateRecoveryRequest Error:", err);
    return { error: "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً" };
  }
}

// Fetch all recovery requests for admin panel
export async function getRecoveryRequests() {
  try {
    const requests = await prisma.forgotPasswordRequest.findMany({
      orderBy: { createdAt: "desc" }
    });

    // Fetch user details (name, image) for all these emails to display in recovery list
    const emails = requests.map(r => r.email);
    const users = await prisma.user.findMany({
      where: {
        email: { in: emails }
      },
      select: {
        email: true,
        name: true,
        image: true
      }
    });

    // Map requests to include user's name and avatar
    const requestsWithUser = requests.map(req => {
      const user = users.find(u => u.email === req.email);
      return {
        ...req,
        userName: user?.name || "مستخدم غير معروف",
        userImage: user?.image || null
      };
    });

    return { success: true, requests: requestsWithUser };
  } catch (err) {
    console.error("GetRecoveryRequests Error:", err);
    return { error: "فشل في جلب طلبات استعادة كلمة المرور" };
  }
}

// Approve recovery request (changes DB password to '2026' and marks as APPROVED)
export async function approveRecoveryRequest(id: string) {
  try {
    const request = await prisma.forgotPasswordRequest.findUnique({ where: { id } });
    if (!request) return { error: "الطلب غير موجود" };

    const user = await prisma.user.findUnique({ where: { email: request.email } });
    if (!user) return { error: "لم يتم العثور على المستخدم صاحب هذا الطلب" };

    // Update user's password in database to "2026"
    await prisma.user.update({
      where: { email: request.email },
      data: {
        password: "2026",
        passwordChangedAt: null // reset cooldown to let them change it immediately
      }
    });

    // Update request status to APPROVED
    await prisma.forgotPasswordRequest.update({
      where: { id },
      data: { status: "APPROVED" }
    });

    return { success: true };
  } catch (err) {
    console.error("ApproveRecoveryRequest Error:", err);
    return { error: "حدث خطأ أثناء الموافقة على الطلب" };
  }
}

// Delete / Reject recovery request
export async function deleteRecoveryRequest(id: string) {
  try {
    await prisma.forgotPasswordRequest.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    console.error("DeleteRecoveryRequest Error:", err);
    return { error: "حدث خطأ أثناء حذف الطلب" };
  }
}
