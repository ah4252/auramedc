"use server";

import { cookies } from "next/headers";

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string;

  // In a real app, this should be a secure hashed password check against the DB.
  // For this mockup, we use a simple secret password.
  if (password === "admin123") {
    (await cookies()).set("admin_token", "secure_session_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  } else {
    return { error: "كلمة المرور غير صحيحة" };
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
    const { prisma } = await import("@/lib/prisma");

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
    const { prisma } = await import("@/lib/prisma");

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return { error: "البريد أو كلمة المرور غير صحيحة" };
    }

    (await cookies()).set("user_token", user.id, {
      httpOnly: true,
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

import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(50, "الاسم طويل جداً"),
  image: z.string().url("رابط الصورة غير صحيح").optional().or(z.literal("")),
});

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  if (!userId) return { error: "يجب تسجيل الدخول أولاً" };

  const rawData = {
    name: formData.get("name") as string,
    image: formData.get("image") as string,
  };

  const validation = updateProfileSchema.safeParse(rawData);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.user.update({
      where: { id: userId },
      data: validation.data
    });
    return { success: true };
  } catch (err) {
    return { error: "حدث خطأ أثناء تحديث البيانات" };
  }
}
