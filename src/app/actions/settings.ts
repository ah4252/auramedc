"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getSettings() {
  const defaultSettings = { 
    id: "global",
    siteName: "Aura Med Elite",
    maintenanceMode: false,
    allowRegistration: true,
    primaryColor: "#0ea5e9",
    secondaryColor: "#6366f1",
    darkBg: "#0f172a",
    adminPassword: "admin",
    toolsPassword: "tools123",
    toolsProtectionEnabled: false,
  };

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
    });

    if (!settings) {
      return defaultSettings;
    }

    return settings;
  } catch (error) {
    console.error("Local Settings Error:", error);
    return defaultSettings;
  }
}

export async function updateSettings(data: any) {
  try {
    const updateData: any = {};
    if (data.siteName !== undefined) updateData.siteName = data.siteName;
    if (data.maintenanceMode !== undefined) updateData.maintenanceMode = data.maintenanceMode;
    if (data.allowRegistration !== undefined) updateData.allowRegistration = data.allowRegistration;
    if (data.primaryColor !== undefined) updateData.primaryColor = data.primaryColor;
    if (data.secondaryColor !== undefined) updateData.secondaryColor = data.secondaryColor;
    if (data.darkBg !== undefined) updateData.darkBg = data.darkBg;

    const updated = await prisma.siteSettings.update({
      where: { id: "global" },
      data: updateData
    });
    
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { success: true, settings: updated };
  } catch (error) {
    console.error("Update Settings Error:", error);
    return { error: "حدث خطأ أثناء تحديث الإعدادات في قاعدة البيانات" };
  }
}

export async function changeAdminPassword(newPassword: string) {
  try {
    await prisma.siteSettings.update({
      where: { id: "global" },
      data: { adminPassword: newPassword }
    });
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء تغيير كلمة المرور" };
  }
}

// ===== Tools Password Protection =====

export async function getToolsProtection() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
      select: { toolsProtectionEnabled: true, toolsPassword: true }
    });
    return {
      enabled: settings?.toolsProtectionEnabled || false,
      password: settings?.toolsPassword || "tools123"
    };
  } catch {
    return { enabled: false, password: "tools123" };
  }
}

export async function updateToolsProtection(data: { enabled?: boolean; newPassword?: string }) {
  try {
    const updateData: any = {};
    if (data.enabled !== undefined) updateData.toolsProtectionEnabled = data.enabled;
    if (data.newPassword && data.newPassword.length >= 4) updateData.toolsPassword = data.newPassword;

    await prisma.siteSettings.update({
      where: { id: "global" },
      data: updateData
    });
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "حدث خطأ أثناء تحديث إعدادات حماية الأدوات" };
  }
}

export async function verifyToolsPassword(password: string) {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
      select: { toolsPassword: true, toolsProtectionEnabled: true }
    });

    if (!settings?.toolsProtectionEnabled) {
      return { success: true };
    }

    const correctPassword = settings.toolsPassword || "tools123";

    if (password === correctPassword) {
      (await cookies()).set("tools_unlocked", "true", {
        httpOnly: true,
        maxAge: 60 * 60 * 4, // 4 hours session
        path: "/",
      });
      return { success: true };
    }

    return { success: false, error: "كلمة مرور الأدوات غير صحيحة" };
  } catch {
    return { success: false, error: "حدث خطأ في التحقق" };
  }
}

export async function isToolsUnlocked() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
      select: { toolsProtectionEnabled: true }
    });

    if (!settings?.toolsProtectionEnabled) return true;

    const cookieStore = await cookies();
    return cookieStore.get("tools_unlocked")?.value === "true";
  } catch {
    return true;
  }
}

export async function lockTools() {
  (await cookies()).delete("tools_unlocked");
  return { success: true };
}

