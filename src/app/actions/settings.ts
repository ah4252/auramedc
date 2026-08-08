"use server";

import { prisma, isDatabaseEnabled } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getSettings() {
  const defaultSettings = { 
    id: "global",
    siteName: "Aura Med Elite",
    maintenanceMode: false,
    maintenanceCourses: false,
    maintenanceSubjects: false,
    maintenancePharmacy: false,
    maintenanceTimetable: false,
    maintenanceGpa: false,
    maintenanceNews: false,
    allowRegistration: true,
    primaryColor: "#0ea5e9",
    secondaryColor: "#6366f1",
    darkBg: "#0f172a",
    adminPassword: "admin",
    toolsPassword: "tools123",
    toolsProtectionEnabled: false,
    statLectures: "",
    statSpecialties: "",
    statStudents: "",
    statSatisfaction: "99%",
    statPharmacy: "",
    socialFacebook: "",
    socialInstagram: "",
    socialTelegram: "",
    socialWhatsapp: "",
    socialEmail: "",
  };

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
      select: {
        id: true,
        siteName: true,
        maintenanceMode: true,
        maintenanceCourses: true,
        maintenanceSubjects: true,
        maintenancePharmacy: true,
        maintenanceTimetable: true,
        maintenanceGpa: true,
        maintenanceNews: true,
        allowRegistration: true,
        primaryColor: true,
        secondaryColor: true,
        darkBg: true,
        adminPassword: true,
        toolsPassword: true,
        toolsProtectionEnabled: true,
        statLectures: true,
        statSpecialties: true,
        statStudents: true,
        statSatisfaction: true,
        statPharmacy: true,
        socialFacebook: true,
        socialInstagram: true,
        socialTelegram: true,
        socialWhatsapp: true,
        socialEmail: true,
      },
    });

    if (!settings) {
      return defaultSettings;
    }

    return { ...defaultSettings, ...settings };
  } catch {
    return defaultSettings;
  }
}

export async function updateSettings(data: any) {
  if (!isDatabaseEnabled()) {
    return { error: "قاعدة البيانات غير متاحة حاليًا" };
  }

  try {
    const updateData: any = {};
    if (data.siteName !== undefined) updateData.siteName = data.siteName;
    if (data.maintenanceMode !== undefined) updateData.maintenanceMode = data.maintenanceMode;
    if (data.maintenanceCourses !== undefined) updateData.maintenanceCourses = data.maintenanceCourses;
    if (data.maintenanceSubjects !== undefined) updateData.maintenanceSubjects = data.maintenanceSubjects;
    if (data.maintenancePharmacy !== undefined) updateData.maintenancePharmacy = data.maintenancePharmacy;
    if (data.maintenanceTimetable !== undefined) updateData.maintenanceTimetable = data.maintenanceTimetable;
    if (data.maintenanceGpa !== undefined) updateData.maintenanceGpa = data.maintenanceGpa;
    if (data.maintenanceNews !== undefined) updateData.maintenanceNews = data.maintenanceNews;
    if (data.allowRegistration !== undefined) updateData.allowRegistration = data.allowRegistration;
    if (data.primaryColor !== undefined) updateData.primaryColor = data.primaryColor;
    if (data.secondaryColor !== undefined) updateData.secondaryColor = data.secondaryColor;
    if (data.darkBg !== undefined) updateData.darkBg = data.darkBg;
    if (data.statLectures !== undefined) updateData.statLectures = data.statLectures;
    if (data.statSpecialties !== undefined) updateData.statSpecialties = data.statSpecialties;
    if (data.statStudents !== undefined) updateData.statStudents = data.statStudents;
    if (data.statSatisfaction !== undefined) updateData.statSatisfaction = data.statSatisfaction;
    if (data.statPharmacy !== undefined) updateData.statPharmacy = data.statPharmacy;
    
    if (data.socialFacebook !== undefined) updateData.socialFacebook = data.socialFacebook;
    if (data.socialInstagram !== undefined) updateData.socialInstagram = data.socialInstagram;
    if (data.socialTelegram !== undefined) updateData.socialTelegram = data.socialTelegram;
    if (data.socialWhatsapp !== undefined) updateData.socialWhatsapp = data.socialWhatsapp;
    if (data.socialEmail !== undefined) updateData.socialEmail = data.socialEmail;

    const updated = await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: updateData,
      create: { id: "global", ...updateData },
    });
    
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { success: true, settings: updated };
  } catch {
    return { error: "حدث خطأ أثناء تحديث الإعدادات في قاعدة البيانات" };
  }
}

export async function changeAdminPassword(newPassword: string) {
  if (!isDatabaseEnabled()) {
    return { error: "قاعدة البيانات غير متاحة حاليًا" };
  }

  try {
    await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: { adminPassword: newPassword },
      create: { id: "global", adminPassword: newPassword },
    });
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء تغيير كلمة المرور" };
  }
}

// ===== Tools Password Protection =====

export async function getToolsProtection() {
  if (!isDatabaseEnabled()) {
    return { enabled: false, password: "tools123" };
  }

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
  if (!isDatabaseEnabled()) {
    return { success: false, error: "قاعدة البيانات غير متاحة حاليًا" };
  }

  try {
    const updateData: any = {};
    if (data.enabled !== undefined) updateData.toolsProtectionEnabled = data.enabled;
    if (data.newPassword && data.newPassword.length >= 4) updateData.toolsPassword = data.newPassword;

    await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: updateData,
      create: { id: "global", ...updateData },
    });
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "حدث خطأ أثناء تحديث إعدادات حماية الأدوات" };
  }
}

export async function verifyToolsPassword(password: string) {
  if (!isDatabaseEnabled()) {
    return { success: true };
  }

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
  if (!isDatabaseEnabled()) {
    return true;
  }

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

export async function getSystemStatus() {
  try {
    const startTime = Date.now();
    const result = await prisma.$queryRaw<any[]>`SELECT 1 as conn`;
    const latency = Date.now() - startTime;
    const isConnected = result && result.length > 0;

    const sizeResult = await prisma.$queryRaw<any[]>`SELECT pg_database_size(current_database()) AS size`;
    const sizeInBytes = Number(sizeResult[0]?.size || 0);

    // Neon free tier limit: 512MB
    const limitBytes = 512 * 1024 * 1024;
    let percentage = (sizeInBytes / limitBytes) * 100;
    if (percentage < 1 && sizeInBytes > 0) percentage = 1;
    if (percentage > 100) percentage = 100;

    let sizeString = "";
    if (sizeInBytes < 1024 * 1024) {
      sizeString = `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
      sizeString = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      sizeString = `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }

    return {
      connected: isConnected,
      latency: `${latency}ms`,
      sizeString,
      percentage: Math.round(percentage),
      rawSize: sizeInBytes
    };
  } catch (error) {
    console.error("System status check failed:", error);
    return {
      connected: false,
      latency: "0ms",
      sizeString: "0 MB",
      percentage: 0,
      rawSize: 0
    };
  }
}

