"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string;

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" }
    });

    // Use DB password or fallback to admin123
    const adminPass = settings?.adminPassword || "admin123";

    if (password === adminPass) {
      (await cookies()).set("admin_token", "secure_session_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return { success: true };
    } else {
      return { error: "كلمة المرور غير صحيحة" };
    }
  } catch (error) {
    return { error: "حدث خطأ في الاتصال بقاعدة البيانات" };
  }
}

export async function logoutAdmin() {
  (await cookies()).delete("admin_token");
}

// --- Student Authentication ---

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) return { error: "الرجاء تعبئة كافة الحقول" };

  try {
  
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "هذا البريد الإلكتروني مسجل مسبقاً" };

    // Create user (Note: Password should be hashed in production)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Ideally use bcrypt here
        role: "USER"
      }
    });

    // Auto login
    (await cookies()).set("user_token", user.id, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return { success: true };
  } catch (err) {
    return { error: "حدث خطأ أثناء التسجيل" };
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "الرجاء إدخال البريد وكلمة المرور" };

  try {
  
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      // Check if there is an approved recovery request for this email
      const approvedRequest = await prisma.forgotPasswordRequest.findFirst({
        where: { email, status: "APPROVED" }
      });
      
      if (approvedRequest) {
        return { 
          error: "لقد تم قبول طلب استعادة حسابك من المطور! يرجى كتابة 2026 في كلمة المرور لتتمكن من الدخول وتغييرها." 
        };
      }

      return { error: "البريد أو كلمة المرور غير صحيحة" };
    }

    (await cookies()).set("user_token", user.id, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    // If the user logged in using the temporary password "2026", update their request status to COMPLETED
    if (password === "2026") {
      try {
        const approvedRequest = await prisma.forgotPasswordRequest.findFirst({
          where: { email, status: "APPROVED" }
        });
        if (approvedRequest) {
          await prisma.forgotPasswordRequest.update({
            where: { id: approvedRequest.id },
            data: { status: "COMPLETED" }
          });
        }
      } catch (err) {
        console.error("Failed to update recovery request to COMPLETED:", err);
      }
    }

    return { success: true };
  } catch (err) {
    return { error: "حدث خطأ أثناء تسجيل الدخول" };
  }
}

export async function logoutUser() {
  (await cookies()).delete("user_token");
}

export async function resetPassword(email: string) {
  if (!email) return { error: "الرجاء إدخال البريد الإلكتروني" };
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "لا يوجد حساب مرتبط بهذا البريد الإلكتروني" };
    return { success: true, password: user.password };
  } catch (err) {
    return { error: "حدث خطأ، يرجى المحاولة مرة أخرى" };
  }
}

// Admin override - no cooldown restriction
export async function adminChangePassword(userId: string, newPassword: string) {
  if (!userId || !newPassword) return { error: "بيانات غير مكتملة" };
  if (newPassword.length < 6) return { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword, passwordChangedAt: new Date() },
    });
    return { success: true };
  } catch (err) {
    return { error: "حدث خطأ أثناء تغيير كلمة المرور" };
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  if (!userId) return { error: "يجب تسجيل الدخول أولاً" };
  if (!currentPassword || !newPassword) return { error: "الرجاء تعبئة جميع الحقول" };
  if (newPassword.length < 6) return { error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" };

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "لم يتم العثور على المستخدم" };
    if (user.password !== currentPassword) return { error: "كلمة المرور الحالية غير صحيحة" };

    // Enforce 30-day cooldown
    if (user.passwordChangedAt) {
      const daysSinceChange = (Date.now() - new Date(user.passwordChangedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceChange < 30) {
        const daysLeft = Math.ceil(30 - daysSinceChange);
        return { error: `يمكنك تغيير كلمة المرور مرة واحدة فقط كل 30 يوماً. تبقّى ${daysLeft} يوم.` };
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword, passwordChangedAt: new Date() },
    });

    return { success: true };
  } catch (err: any) {
    console.error("ChangePassword Error:", err);
    return { error: `حدث خطأ أثناء تغيير كلمة المرور: ${err?.message || err || 'خطأ غير معروف'}` };
  }
}

import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(50, "الاسم طويل جداً"),
  image: z.string().url("رابط الصورة غير صحيح").optional().or(z.literal("")),
  telegram: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
});

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  if (!userId) return { error: "يجب تسجيل الدخول أولاً" };

  const rawData = {
    name: formData.get("name") as string,
    image: formData.get("image") as string,
    telegram: formData.get("telegram") as string,
    instagram: formData.get("instagram") as string,
    facebook: formData.get("facebook") as string,
  };

  const validation = updateProfileSchema.safeParse(rawData);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
      
    await prisma.$executeRaw`
      UPDATE "User" SET name = ${validation.data.name}, image = ${validation.data.image || null}, telegram = ${validation.data.telegram || null}, instagram = ${validation.data.instagram || null}, facebook = ${validation.data.facebook || null} WHERE id = ${userId}
    `;

    return { success: true };
  } catch (err: any) {
    console.error("Profile update error:", err);
    return { error: `فشل الحفظ: ${err.message || "خطأ غير معروف"}` };
  }
}
