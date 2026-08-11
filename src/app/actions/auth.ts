"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateAdminToken, verifyAdminToken } from "@/lib/auth-helpers";
import { z } from "zod";

// ============================================================
// Admin Authentication — مصادقة المدير
// ============================================================

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string;

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
    });

    const adminPass = settings?.adminPassword || "admin123";

    if (password !== adminPass) {
      return { error: "كلمة المرور غير صحيحة" };
    }

    // توليد توكن آمن وعشوائي — لا يمكن تزويره
    const secureToken = generateAdminToken();

    (await cookies()).set("admin_token", secureToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 أيام
      path: "/",
    });

    return { success: true };
  } catch (error: any) {
    console.error("[loginAdmin] DB Error:", error?.message || error);
    return { error: `حدث خطأ في الاتصال بقاعدة البيانات: ${error?.message || "خطأ غير معروف"}` };
  }
}

export async function logoutAdmin() {
  (await cookies()).delete("admin_token");
}

// ============================================================
// Student Authentication — مصادقة الطلاب
// ============================================================

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const studyYear = (formData.get("studyYear") as string)?.trim() || "";
  const wilaya = (formData.get("wilaya") as string)?.trim() || "";

  if (!name || !email || !password || !studyYear || !wilaya) return { error: "الرجاء تعبئة كافة الحقول" };
  if (password.length < 6) return { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "هذا البريد الإلكتروني مسجل مسبقاً" };

    // ✅ تشفير كلمة المرور قبل الحفظ
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        studyYear,
        wilaya,
        role: "USER",
      },
    });

    (await cookies()).set("user_token", user.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 يوماً
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

    if (!user) {
      return { error: "البريد أو كلمة المرور غير صحيحة" };
    }

    if (!user.password) {
      return { error: "البريد أو كلمة المرور غير صحيحة" };
    }

    // ✅ نظام انتقالي: نتحقق من bcrypt أولاً، ثم النص الصريح (للحسابات القديمة) ونُعيد التشفير
    let isValid = false;

    try {
      // هل كلمة المرور مشفرة بـ bcrypt؟
      isValid = await bcrypt.compare(password, user.password);
    } catch {
      // ليست bcrypt hash — نتحقق من النص الصريح (الحسابات القديمة)
    }

    // إذا لم تنجح bcrypt، نتحقق من النص الصريح ونُعيد التشفير تلقائياً
    if (!isValid && user.password === password) {
      isValid = true;
      // إعادة التشفير تلقائياً لتحديث الحساب القديم
      const newHash = await bcrypt.hash(password, 12);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: newHash },
      });
    }

    if (!isValid) {
      // التحقق من طلب استعادة الحساب المعتمد
      const approvedRequest = await prisma.forgotPasswordRequest.findFirst({
        where: { email, status: "APPROVED" },
      });

      if (approvedRequest) {
        return {
          error: "لقد تم قبول طلب استعادة حسابك! يرجى استخدام كلمة المرور المؤقتة التي أرسلها لك المطور.",
        };
      }

      return { error: "البريد أو كلمة المرور غير صحيحة" };
    }

    // ✅ التحقق مما إذا كان هناك طلب استعادة مقبول (كلمة مرور مؤقتة)
    const approvedRequest = await prisma.forgotPasswordRequest.findFirst({
      where: { email, status: "APPROVED" },
    });

    if (approvedRequest) {
      // نطلب من الواجهة الأمامية إعادة تعيين كلمة المرور فوراً ولا نقوم بإنشاء الجلسة هنا
      return { 
        success: true, 
        requiresPasswordReset: true, 
        email, 
        tempPassword: password 
      };
    }

    (await cookies()).set("user_token", user.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return { success: true };
  } catch (err) {
    return { error: "حدث خطأ أثناء تسجيل الدخول" };
  }
}

export async function logoutUser() {
  (await cookies()).delete("user_token");
}

/**
 * ⚠️ تم إزالة دالة resetPassword الخطيرة التي كانت تُرجع كلمة المرور الأصلية للمستخدمين.
 * بدلاً منها، يستخدم النظام نظام الاستعادة عبر المدير (recovery.ts).
 */

export async function adminChangePassword(userId: string, newPassword: string) {
  if (!userId || !newPassword) return { error: "بيانات غير مكتملة" };
  if (newPassword.length < 6) return { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };
  try {
    // ✅ تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, passwordChangedAt: new Date() },
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

    if (!user.password) {
      return { error: "الحساب لا يحتوي على كلمة مرور صالحة لتعديلها" };
    }

    // ✅ التحقق من كلمة المرور الحالية بشكل آمن
    let isCurrentValid = false;
    try {
      isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    } catch {
      // حساب قديم بنص صريح
      isCurrentValid = user.password === currentPassword;
    }

    if (!isCurrentValid) return { error: "كلمة المرور الحالية غير صحيحة" };

    // تطبيق حد 30 يوماً
    if (user.passwordChangedAt) {
      const daysSinceChange =
        (Date.now() - new Date(user.passwordChangedAt).getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSinceChange < 30) {
        const daysLeft = Math.ceil(30 - daysSinceChange);
        return {
          error: `يمكنك تغيير كلمة المرور مرة واحدة فقط كل 30 يوماً. تبقّى ${daysLeft} يوم.`,
        };
      }
    }

    // ✅ تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, passwordChangedAt: new Date() },
    });

    return { success: true };
  } catch (err: any) {
    console.error("ChangePassword Error:", err);
    return { error: `حدث خطأ أثناء تغيير كلمة المرور: ${err?.message || "خطأ غير معروف"}` };
  }
}

// ============================================================
// Profile Update — تحديث الملف الشخصي
// ============================================================

const updateProfileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(50, "الاسم طويل جداً"),
  image: z.string().max(200000, "رابط الصورة طويل جداً").optional().or(z.literal(""
  )).refine((value) => {
    if (!value) return true;
    return value.startsWith("/") || value.startsWith("data:") || z.string().url().safeParse(value).success;
  }, "رابط الصورة غير صحيح"),
  studyYear: z.string().max(50, "السنة الدراسية طويلة جداً").optional().or(z.literal("")),
  wilaya: z.string().max(100, "اسم الولاية طويل جداً").optional().or(z.literal("")),
  telegram: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
});

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  if (!userId) return { error: "يجب تسجيل الدخول أولاً" };

  const imageFile = formData.get("imageFile") as File | null;
  const removeImage = formData.get("removeImage") === "true";
  const currentUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!currentUser) return { error: "المستخدم غير موجود" };

  let imageUrl: string | null = currentUser.image || null;

  if (removeImage) {
    imageUrl = null;
  } else if (imageFile && typeof imageFile.arrayBuffer === "function") {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const mimeType = imageFile.type && imageFile.type.startsWith("image/") ? imageFile.type : "image/png";
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      imageUrl = `data:${mimeType};base64,${base64}`;
    } catch (err: any) {
      console.error("Profile image upload error:", err);
      return { error: "فشل رفع الصورة، حاول مرة أخرى" };
    }
  }

  const rawData = {
    name: formData.get("name") as string,
    image: imageUrl || "",
    studyYear: formData.get("studyYear") as string,
    wilaya: formData.get("wilaya") as string,
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
      UPDATE "User" SET name = ${validation.data.name}, image = ${validation.data.image || null}, "studyYear" = ${validation.data.studyYear || null}, wilaya = ${validation.data.wilaya || null}, telegram = ${validation.data.telegram || null}, instagram = ${validation.data.instagram || null}, facebook = ${validation.data.facebook || null} WHERE id = ${userId}
    `;

    return { success: true };
  } catch (err: any) {
    console.error("Profile update error:", err);
    return { error: `فشل الحفظ: ${err.message || "خطأ غير معروف"}` };
  }
}

export async function updateProfileImage(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  if (!userId) return { error: "يجب تسجيل الدخول أولاً" };

  const imageFile = formData.get("imageFile") as File | null;
  const removeImage = formData.get("removeImage") === "true";
  const currentUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!currentUser) return { error: "المستخدم غير موجود" };

  let imageUrl: string | null = currentUser.image || null;

  if (removeImage) {
    imageUrl = null;
  } else if (imageFile && typeof imageFile.arrayBuffer === "function") {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const mimeType = imageFile.type && imageFile.type.startsWith("image/") ? imageFile.type : "image/png";
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      imageUrl = `data:${mimeType};base64,${base64}`;
    } catch (err: any) {
      console.error("Profile image upload error:", err);
      return { error: "فشل رفع الصورة، حاول مرة أخرى" };
    }
  }

  try {
    await prisma.$executeRaw`
      UPDATE "User" SET image = ${imageUrl || null} WHERE id = ${userId}
    `;
    return { success: true };
  } catch (err: any) {
    console.error("Profile image update error:", err);
    return { error: `فشل حفظ الصورة: ${err.message || "خطأ غير معروف"}` };
  }
}

// Complete password reset (setting custom password after login with temporary password)
export async function resetForgotPassword(email: string, tempPassword: string, newPassword: string) {
  if (!email || !tempPassword || !newPassword) {
    return { error: "جميع الحقول مطلوبة" };
  }
  if (newPassword.length < 6) {
    return { error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return { error: "لم يتم العثور على المستخدم" };
    }

    // Verify current database password matches the temp password
    const isTempValid = await bcrypt.compare(tempPassword, user.password);
    if (!isTempValid) {
      return { error: "كلمة المرور المؤقتة غير صالحة أو منتهية الصلاحية" };
    }

    // Verify there is an APPROVED request
    const approvedRequest = await prisma.forgotPasswordRequest.findFirst({
      where: { email, status: "APPROVED" },
    });
    if (!approvedRequest) {
      return { error: "لم يتم العثور على طلب استعادة حساب معتمد" };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    // Update request status to COMPLETED
    await prisma.forgotPasswordRequest.update({
      where: { id: approvedRequest.id },
      data: { status: "COMPLETED" },
    });

    // Log the user in by setting the cookie
    (await cookies()).set("user_token", user.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return { success: true };
  } catch (err) {
    console.error("Error resetting forgot password:", err);
    return { error: "حدث خطأ غير متوقع أثناء إعادة تعيين كلمة المرور" };
  }
}

// ============================================================
// Delete Account — حذف الحساب نهائياً
// ============================================================

export async function deleteAccount(password: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  if (!userId) return { error: "يجب تسجيل الدخول أولاً" };

  if (!password) return { error: "كلمة المرور مطلوبة" };

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) return { error: "لم يتم العثور على المستخدم" };

    // التحقق من كلمة المرور
    let isValid = false;
    try {
      isValid = await bcrypt.compare(password, user.password);
    } catch {
      isValid = user.password === password;
    }

    if (!isValid) return { error: "كلمة المرور غير صحيحة" };

    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { userId } }),
      prisma.favorite.deleteMany({ where: { userId } }),
      prisma.progress.deleteMany({ where: { userId } }),
      prisma.gPACalculation.deleteMany({ where: { userId } }),
      prisma.newsComment.deleteMany({ where: { userId } }),
      prisma.friendship.deleteMany({ where: { OR: [{ userId }, { friendId: userId }] } }),
      prisma.user.delete({ where: { id: userId } })
    ]);

    // تسجيل الخروج بعد الحذف
    cookieStore.delete("user_token");

    return { success: true };
  } catch (err: any) {
    console.error("Delete Account Error:", err);
    return { error: "حدث خطأ أثناء حذف الحساب" };
  }
}
